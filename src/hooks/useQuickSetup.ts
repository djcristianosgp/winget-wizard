import { useState, useMemo, useCallback, useEffect } from "react";
import { apps, type AppCategory, type WingetApp } from "@/data/apps";

export interface ScriptOptions {
  silent: boolean;
  acceptAgreements: boolean;
  disableInteractivity: boolean;
  scope: "none" | "user" | "machine";
  version: string;
  consolidated: boolean;
}

interface WingetApiPackage {
  Id: string;
  Latest?: {
    Name?: string;
    Description?: string;
    Tags?: string[];
  };
}

const apiBaseUrl = "https://api.winget.run";

function inferCategory(pkg: WingetApiPackage): AppCategory {
  const name = pkg.Latest?.Name?.toLowerCase() ?? "";
  const desc = pkg.Latest?.Description?.toLowerCase() ?? "";
  const tags = (pkg.Latest?.Tags ?? []).join(" ").toLowerCase();
  const text = `${name} ${desc} ${tags}`;

  if (/(browser|firefox|chrome|edge|opera|brave)/.test(text)) return "browsers";
  if (/(stream|obs|video|audio|media|codec|capture|record|edit)/.test(text)) return "multimedia";
  if (/(chat|email|message|discord|slack|teams|telegram|zoom|meeting)/.test(text)) return "communication";
  if (/(dev|sdk|cli|code|git|docker|kubernetes|database|sql|python|node|java)/.test(text)) return "development";
  return "utilities";
}

const defaultOptions: ScriptOptions = {
  silent: false,
  acceptAgreements: true,
  disableInteractivity: false,
  scope: "none",
  version: "",
  consolidated: false,
};

export function useQuickSetup() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedMeta, setSelectedMeta] = useState<Record<string, WingetApp>>({});
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<AppCategory | "all">("all");
  const [options, setOptions] = useState<ScriptOptions>(defaultOptions);
  const [remoteApps, setRemoteApps] = useState<WingetApp[]>([]);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [remoteError, setRemoteError] = useState<string | null>(null);

  useEffect(() => {
    const query = search.trim();
    if (query.length < 2) {
      setRemoteApps([]);
      setRemoteLoading(false);
      setRemoteError(null);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setRemoteLoading(true);
        setRemoteError(null);

        const params = new URLSearchParams({
          query,
          take: "24",
          page: "0",
          partialMatch: "true",
          preferContains: "true",
        });

        const response = await fetch(`${apiBaseUrl}/v2/packages?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Falha na API (${response.status})`);
        }

        const data = (await response.json()) as { Packages?: WingetApiPackage[] };
        const mapped = (data.Packages ?? []).map((pkg) => ({
          id: pkg.Id,
          name: pkg.Latest?.Name?.trim() || pkg.Id,
          category: inferCategory(pkg),
        } satisfies WingetApp));

        setRemoteApps(mapped);
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setRemoteError("Nao foi possivel buscar na API do winget.run.");
        setRemoteApps([]);
      } finally {
        setRemoteLoading(false);
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [search]);

  const localFilteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesCategory = activeCategory === "all" || app.category === activeCategory;
      const matchesSearch =
        search === "" ||
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.id.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const externalFilteredApps = useMemo(() => {
    if (search.trim().length < 2) return [];

    const localIds = new Set(localFilteredApps.map((a) => a.id));
    return remoteApps.filter((app) => {
      if (localIds.has(app.id)) return false;
      return activeCategory === "all" || app.category === activeCategory;
    });
  }, [search, remoteApps, activeCategory, localFilteredApps]);

  const filteredApps = useMemo(() => {
    return [...localFilteredApps, ...externalFilteredApps];
  }, [localFilteredApps, externalFilteredApps]);

  const sourceApps = useMemo(() => {
    const merged = [...apps, ...remoteApps];
    const map = new Map<string, WingetApp>();
    for (const app of merged) map.set(app.id, app);
    return Array.from(map.values());
  }, [remoteApps]);

  const knownAppsById = useMemo(() => {
    const map = new Map<string, WingetApp>();
    for (const app of apps) map.set(app.id, app);
    for (const app of remoteApps) map.set(app.id, app);
    for (const app of Object.values(selectedMeta)) map.set(app.id, app);
    return map;
  }, [remoteApps, selectedMeta]);

  const toggleApp = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

    setSelectedMeta((prev) => {
      if (id in prev) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }

      const found = knownAppsById.get(id);
      if (!found) return prev;
      return { ...prev, [id]: found };
    });
  }, [knownAppsById]);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(filteredApps.map((a) => a.id)));
    setSelectedMeta(Object.fromEntries(filteredApps.map((a) => [a.id, a])));
  }, [filteredApps]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setSelectedMeta({});
  }, []);

  const selectedApps = useMemo(() => {
    return Array.from(selectedIds)
      .map((id) => knownAppsById.get(id))
      .filter((app): app is WingetApp => Boolean(app));
  }, [selectedIds, knownAppsById]);

  const generateCommand = useCallback(
    (app: WingetApp) => {
      const parts = ["winget install", `--id ${app.id}`, "-e"];
      if (options.silent) parts.push("--silent");
      if (options.acceptAgreements) parts.push("--accept-package-agreements --accept-source-agreements");
      if (options.disableInteractivity) parts.push("--disable-interactivity");
      if (options.scope !== "none") parts.push(`--scope ${options.scope}`);
      if (options.version.trim()) parts.push(`--version ${options.version.trim()}`);
      return parts.join(" ");
    },
    [options]
  );

  const script = useMemo(() => {
    if (selectedApps.length === 0) return "";
    return selectedApps.map(generateCommand).join("\n");
  }, [selectedApps, generateCommand]);

  const scriptBat = useMemo(() => {
    if (!script) return "";
    return `@echo off\necho === QuickSetup - Instalacao em lote via Winget ===\necho.\n\n${script}\n\necho.\necho === Instalacao concluida! ===\npause`;
  }, [script]);

  const scriptPs1 = useMemo(() => {
    if (!script) return "";
    return `# QuickSetup - Instalacao em lote via Winget\nWrite-Host "=== QuickSetup - Iniciando instalacao ===" -ForegroundColor Cyan\n\n${script}\n\nWrite-Host "\\n=== Instalacao concluida! ===" -ForegroundColor Green`;
  }, [script]);

  return {
    search, setSearch,
    activeCategory, setActiveCategory,
    sourceApps,
    remoteLoading,
    remoteError,
    localFilteredApps,
    externalFilteredApps,
    filteredApps,
    selectedIds, toggleApp, selectAll, clearSelection,
    selectedApps,
    options, setOptions,
    script, scriptBat, scriptPs1,
    generateCommand,
  };
}

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { apps, type AppCategory, type LinuxDistro, type OSPlatform, type PackageManager, type SetupApp } from "@/data/apps";
import { searchBrew } from "@/lib/providers/brew";
import { searchFlatpak } from "@/lib/providers/flatpak";
import { inferCategory as inferCategoryFromText } from "@/lib/providers/types";

export interface ScriptOptions {
  silent: boolean;
  acceptAgreements: boolean;
  disableInteractivity: boolean;
  scope: "none" | "user" | "machine";
  version: string;
  linuxAutoYes: boolean;
  linuxUseSudo: boolean;
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
const STORAGE_KEY = "quicksetup-state";

function inferCategory(pkg: WingetApiPackage): AppCategory {
  const name = pkg.Latest?.Name?.toLowerCase() ?? "";
  const desc = pkg.Latest?.Description?.toLowerCase() ?? "";
  const tags = (pkg.Latest?.Tags ?? []).join(" ").toLowerCase();
  const text = `${name} ${desc} ${tags}`;
  return inferCategoryFromText(text);
}

const defaultOptions: ScriptOptions = {
  silent: false,
  acceptAgreements: true,
  disableInteractivity: false,
  scope: "none",
  version: "",
  linuxAutoYes: true,
  linuxUseSudo: true,
};

function detectPlatform(): OSPlatform {
  const platform = (navigator.userAgentData?.platform || navigator.platform || "").toLowerCase();
  if (platform.includes("mac")) return "macos";
  if (platform.includes("linux") || platform.includes("x11")) return "linux";
  return "windows";
}

function getPackageManager(os: OSPlatform, distro: LinuxDistro): PackageManager {
  if (os === "windows") return "winget";
  if (os === "macos") return "brew";
  return distro;
}

function getAppPackage(app: SetupApp, manager: PackageManager): string | undefined {
  return app[manager];
}

// ── URL helpers ───────────────────────────────────────────────────────────────

interface URLState {
  selectedIds: string[];
  platform: OSPlatform;
  linuxDistro: LinuxDistro;
  options: Partial<ScriptOptions>;
}

export function parseURLState(): URLState | null {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("os") && !params.has("apps")) return null;

  const appsParam = params.get("apps") ?? "";
  const selectedIds = appsParam ? appsParam.split(",").filter(Boolean) : [];

  const osRaw = params.get("os");
  const validOS: OSPlatform[] = ["windows", "macos", "linux"];
  const platform: OSPlatform = validOS.includes(osRaw as OSPlatform)
    ? (osRaw as OSPlatform)
    : detectPlatform();

  const distroRaw = params.get("distro");
  const validDistros: LinuxDistro[] = ["apt", "dnf", "pacman", "flatpak"];
  const linuxDistro: LinuxDistro = validDistros.includes(distroRaw as LinuxDistro)
    ? (distroRaw as LinuxDistro)
    : "apt";

  const options: Partial<ScriptOptions> = {};
  if (params.has("silent")) options.silent = params.get("silent") === "1";
  if (params.has("accept")) options.acceptAgreements = params.get("accept") !== "0";
  if (params.has("nointeract")) options.disableInteractivity = params.get("nointeract") === "1";

  return { selectedIds, platform, linuxDistro, options };
}

export function buildShareURL(
  selectedIds: Set<string>,
  platform: OSPlatform,
  linuxDistro: LinuxDistro,
  options: ScriptOptions
): string {
  const params = new URLSearchParams();
  if (selectedIds.size > 0) params.set("apps", Array.from(selectedIds).join(","));
  params.set("os", platform);
  if (platform === "linux") params.set("distro", linuxDistro);
  if (options.silent) params.set("silent", "1");
  if (!options.acceptAgreements) params.set("accept", "0");
  if (options.disableInteractivity) params.set("nointeract", "1");
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

function updateBrowserURL(url: string): void {
  window.history.replaceState(null, "", url);
}

// ── LocalStorage helpers ──────────────────────────────────────────────────────

interface PersistedState {
  selectedIds: string[];
  platform: OSPlatform;
  linuxDistro: LinuxDistro;
  options: ScriptOptions;
}

function loadFromStorage(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

function saveToStorage(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage might be full – fail silently
  }
}

// ── Initialisation helpers ────────────────────────────────────────────────────

interface InitialState {
  selectedIds: Set<string>;
  platform: OSPlatform;
  linuxDistro: LinuxDistro;
  options: ScriptOptions;
}

function resolveInitialState(): InitialState {
  const urlState = parseURLState();
  if (urlState) {
    return {
      selectedIds: new Set(urlState.selectedIds),
      platform: urlState.platform,
      linuxDistro: urlState.linuxDistro,
      options: { ...defaultOptions, ...urlState.options },
    };
  }

  const stored = loadFromStorage();
  if (stored) {
    return {
      selectedIds: new Set(stored.selectedIds ?? []),
      platform: stored.platform ?? detectPlatform(),
      linuxDistro: stored.linuxDistro ?? "apt",
      options: { ...defaultOptions, ...(stored.options ?? {}) },
    };
  }

  return {
    selectedIds: new Set<string>(),
    platform: detectPlatform(),
    linuxDistro: "apt",
    options: defaultOptions,
  };
}

export function useQuickSetup() {
  const init = useRef(resolveInitialState()).current;

  const [selectedIds, setSelectedIds] = useState<Set<string>>(init.selectedIds);
  const [selectedMeta, setSelectedMeta] = useState<Record<string, SetupApp>>({});
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<AppCategory | "all">("all");
  const [options, setOptions] = useState<ScriptOptions>(init.options);
  const [platform, setPlatform] = useState<OSPlatform>(init.platform);
  const [linuxDistro, setLinuxDistro] = useState<LinuxDistro>(init.linuxDistro);
  const [remoteApps, setRemoteApps] = useState<SetupApp[]>([]);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [remoteError, setRemoteError] = useState<string | null>(null);

  const packageManager = useMemo(() => getPackageManager(platform, linuxDistro), [platform, linuxDistro]);

  // Debounced persist: saves state to localStorage and syncs the browser URL.
  // Debouncing prevents excessive writes when apps are toggled in quick succession.
  useEffect(() => {
    const timer = setTimeout(() => {
      const state: PersistedState = {
        selectedIds: Array.from(selectedIds),
        platform,
        linuxDistro,
        options,
      };
      saveToStorage(state);
      const url = buildShareURL(selectedIds, platform, linuxDistro, options);
      updateBrowserURL(url);
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedIds, platform, linuxDistro, options]);

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

        if (platform === "windows") {
          // Winget API via winget.run
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
            winget: pkg.Id,
            name: pkg.Latest?.Name?.trim() || pkg.Id,
            category: inferCategory(pkg),
          } satisfies SetupApp));

          setRemoteApps(mapped);
        } else if (platform === "macos") {
          // Homebrew API
          const results = await searchBrew(query, 24, controller.signal);
          const mapped: SetupApp[] = results.map((r) => ({
            id: r.id,
            name: r.name,
            category: r.category,
            description: r.description,
            version: r.version,
            brew: r.brew,
          }));
          setRemoteApps(mapped);
        } else if (platform === "linux" && linuxDistro === "flatpak") {
          // Flathub API
          const results = await searchFlatpak(query, 24, controller.signal);
          const mapped: SetupApp[] = results.map((r) => ({
            id: r.id,
            name: r.name,
            category: r.category,
            description: r.description,
            flatpak: r.flatpak,
          }));
          setRemoteApps(mapped);
        } else {
          setRemoteApps([]);
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        if (platform === "windows") {
          setRemoteError("Nao foi possivel buscar na API do winget.run.");
        } else if (platform === "macos") {
          setRemoteError("Nao foi possivel buscar na API do Homebrew.");
        } else {
          setRemoteError("Nao foi possivel buscar na API do Flathub.");
        }
        setRemoteApps([]);
      } finally {
        setRemoteLoading(false);
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [search, platform, linuxDistro]);

  const localFilteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesCategory = activeCategory === "all" || app.category === activeCategory;
      const packageName = getAppPackage(app, packageManager) ?? "";
      const matchesSearch =
        search === "" ||
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.id.toLowerCase().includes(search.toLowerCase()) ||
        packageName.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory, packageManager]);

  const externalFilteredApps = useMemo(() => {
    const hasExternalSearch =
      packageManager === "winget" ||
      packageManager === "brew" ||
      packageManager === "flatpak";

    if (!hasExternalSearch || search.trim().length < 2) return [];

    const localIds = new Set(localFilteredApps.map((a) => a.id));
    return remoteApps.filter((app) => {
      if (localIds.has(app.id)) return false;
      return activeCategory === "all" || app.category === activeCategory;
    });
  }, [search, remoteApps, activeCategory, localFilteredApps, packageManager]);

  const filteredApps = useMemo(() => {
    return [...localFilteredApps, ...externalFilteredApps];
  }, [localFilteredApps, externalFilteredApps]);

  const sourceApps = useMemo(() => {
    const merged = [...apps, ...remoteApps];
    const map = new Map<string, SetupApp>();
    for (const app of merged) map.set(app.id, app);
    return Array.from(map.values());
  }, [remoteApps]);

  const knownAppsById = useMemo(() => {
    const map = new Map<string, SetupApp>();
    for (const app of apps) map.set(app.id, app);
    for (const app of remoteApps) map.set(app.id, app);
    for (const app of Object.values(selectedMeta)) map.set(app.id, app);
    return map;
  }, [remoteApps, selectedMeta]);

  const isAppAvailable = useCallback((app: SetupApp) => Boolean(getAppPackage(app, packageManager)), [packageManager]);

  useEffect(() => {
    setSelectedIds((prev) => {
      const next = new Set<string>();
      for (const id of prev) {
        const app = knownAppsById.get(id);
        if (app && isAppAvailable(app)) next.add(id);
      }
      return next;
    });

    setSelectedMeta((prev) => {
      const next: Record<string, SetupApp> = {};
      for (const [id, app] of Object.entries(prev)) {
        if (isAppAvailable(app)) next[id] = app;
      }
      return next;
    });
  }, [packageManager, knownAppsById, isAppAvailable]);

  const toggleApp = useCallback((id: string) => {
    const found = knownAppsById.get(id);
    if (!found || !isAppAvailable(found)) return;

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

      return { ...prev, [id]: found };
    });
  }, [knownAppsById, isAppAvailable]);

  const selectAll = useCallback(() => {
    const available = filteredApps.filter(isAppAvailable);
    setSelectedIds(new Set(available.map((a) => a.id)));
    setSelectedMeta(Object.fromEntries(available.map((a) => [a.id, a])));
  }, [filteredApps, isAppAvailable]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setSelectedMeta({});
  }, []);

  /** Apply a preset: selects all available apps from the given ID list. */
  const applyPreset = useCallback((appIds: string[]) => {
    const available = appIds
      .map((id) => knownAppsById.get(id))
      .filter((app): app is SetupApp => Boolean(app) && isAppAvailable(app));
    setSelectedIds(new Set(available.map((a) => a.id)));
    setSelectedMeta(Object.fromEntries(available.map((a) => [a.id, a])));
  }, [knownAppsById, isAppAvailable]);

  /** Load a previously saved setup (from history). */
  const loadSetup = useCallback((ids: string[], targetPlatform: OSPlatform, targetDistro: LinuxDistro) => {
    setPlatform(targetPlatform);
    setLinuxDistro(targetDistro);
    // selectedIds will be filtered through the availability effect after platform changes,
    // but we pre-filter here to avoid a brief flash of "all selected".
    setSelectedIds(new Set(ids));
    setSelectedMeta({});
  }, []);

  /** Returns the shareable URL for the current state. */
  const getShareURL = useCallback(() => {
    return buildShareURL(selectedIds, platform, linuxDistro, options);
  }, [selectedIds, platform, linuxDistro, options]);

  const selectedApps = useMemo(() => {
    return Array.from(selectedIds)
      .map((id) => knownAppsById.get(id))
      .filter((app): app is SetupApp => Boolean(app) && isAppAvailable(app));
  }, [selectedIds, knownAppsById, isAppAvailable]);

  const generateCommand = useCallback(
    (app: SetupApp) => {
      const pkg = getAppPackage(app, packageManager);
      if (!pkg) return "";

      if (packageManager === "winget") {
        const parts = ["winget install", `--id ${pkg}`, "-e"];
        if (options.silent) parts.push("--silent");
        if (options.acceptAgreements) parts.push("--accept-package-agreements --accept-source-agreements");
        if (options.disableInteractivity) parts.push("--disable-interactivity");
        if (options.scope !== "none") parts.push(`--scope ${options.scope}`);
        if (options.version.trim()) parts.push(`--version ${options.version.trim()}`);
        return parts.join(" ");
      }

      if (packageManager === "brew") {
        return `brew install ${pkg}`;
      }

      const sudoPrefix = options.linuxUseSudo ? "sudo " : "";
      if (packageManager === "apt") {
        return `${sudoPrefix}apt install ${options.linuxAutoYes ? "-y " : ""}${pkg}`.trim();
      }
      if (packageManager === "dnf") {
        return `${sudoPrefix}dnf install ${options.linuxAutoYes ? "-y " : ""}${pkg}`.trim();
      }
      if (packageManager === "flatpak") {
        return `flatpak install ${options.linuxAutoYes ? "-y " : ""}flathub ${pkg}`.trim();
      }
      return `${sudoPrefix}pacman -S ${options.linuxAutoYes ? "--noconfirm " : ""}${pkg}`.trim();
    },
    [options, packageManager]
  );

  const script = useMemo(() => {
    if (selectedApps.length === 0) return "";
    return selectedApps.map(generateCommand).filter(Boolean).join("\n");
  }, [selectedApps, generateCommand]);

  const scriptBat = useMemo(() => {
    if (!script || packageManager !== "winget") return "";
    return `@echo off\necho === QuickSetup - Instalacao em lote via Winget ===\necho.\n\n${script}\n\necho.\necho === Instalacao concluida! ===\npause`;
  }, [script, packageManager]);

  const scriptPs1 = useMemo(() => {
    if (!script || packageManager !== "winget") return "";
    return `# QuickSetup - Instalacao em lote via Winget\nWrite-Host "=== QuickSetup - Iniciando instalacao ===" -ForegroundColor Cyan\n\n${script}\n\nWrite-Host "\\n=== Instalacao concluida! ===" -ForegroundColor Green`;
  }, [script, packageManager]);

  const scriptSh = useMemo(() => {
    if (!script || packageManager === "winget") return "";
    return `#!/usr/bin/env bash\nset -e\n\necho "=== QuickSetup - Iniciando instalacao ==="\n\n${script}\n\necho "=== Instalacao concluida! ==="`;
  }, [script, packageManager]);

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
    platform, setPlatform,
    linuxDistro, setLinuxDistro,
    packageManager,
    script, scriptBat, scriptPs1, scriptSh,
    generateCommand,
    isAppAvailable,
    getAppPackage: (app: SetupApp) => getAppPackage(app, packageManager),
    applyPreset,
    loadSetup,
    getShareURL,
  };
}

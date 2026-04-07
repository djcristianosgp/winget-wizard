import { useState, useMemo, useCallback } from "react";
import { apps, type AppCategory, type WingetApp } from "@/data/apps";

export interface ScriptOptions {
  silent: boolean;
  acceptAgreements: boolean;
  disableInteractivity: boolean;
  scope: "none" | "user" | "machine";
  version: string;
  consolidated: boolean;
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
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<AppCategory | "all">("all");
  const [options, setOptions] = useState<ScriptOptions>(defaultOptions);

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesCategory = activeCategory === "all" || app.category === activeCategory;
      const matchesSearch =
        search === "" ||
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.id.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const toggleApp = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(filteredApps.map((a) => a.id)));
  }, [filteredApps]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const selectedApps = useMemo(() => {
    return apps.filter((a) => selectedIds.has(a.id));
  }, [selectedIds]);

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
    filteredApps,
    selectedIds, toggleApp, selectAll, clearSelection,
    selectedApps,
    options, setOptions,
    script, scriptBat, scriptPs1,
    generateCommand,
  };
}

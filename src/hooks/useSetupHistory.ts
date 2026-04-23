import { useState } from "react";
import type { LinuxDistro, OSPlatform } from "@/data/apps";

const HISTORY_KEY = "quicksetup-history";
const MAX_ENTRIES = 10;

export interface SetupEntry {
  id: string;
  name: string;
  date: string;
  selectedIds: string[];
  platform: OSPlatform;
  linuxDistro: LinuxDistro;
}

function loadHistory(): SetupEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SetupEntry[];
  } catch {
    return [];
  }
}

function persistHistory(entries: SetupEntry[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  } catch {
    // storage might be full – fail silently
  }
}

export function useSetupHistory() {
  const [history, setHistory] = useState<SetupEntry[]>(loadHistory);

  const saveSetup = (
    name: string,
    selectedIds: string[],
    platform: OSPlatform,
    linuxDistro: LinuxDistro
  ): SetupEntry => {
    const entry: SetupEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim() || "Setup sem nome",
      date: new Date().toISOString(),
      selectedIds,
      platform,
      linuxDistro,
    };
    const next = [entry, ...history].slice(0, MAX_ENTRIES);
    setHistory(next);
    persistHistory(next);
    return entry;
  };

  const deleteSetup = (id: string): void => {
    const next = history.filter((e) => e.id !== id);
    setHistory(next);
    persistHistory(next);
  };

  return { history, saveSetup, deleteSetup };
}

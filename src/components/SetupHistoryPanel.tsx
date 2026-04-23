import { useState } from "react";
import { Save, Trash2, RotateCcw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { SetupEntry } from "@/hooks/useSetupHistory";
import type { LinuxDistro, OSPlatform } from "@/data/apps";

interface Props {
  history: SetupEntry[];
  currentIds: string[];
  currentPlatform: OSPlatform;
  currentDistro: LinuxDistro;
  onSave: (name: string) => void;
  onLoad: (entry: SetupEntry) => void;
  onDelete: (id: string) => void;
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

const platformLabel: Record<OSPlatform, string> = {
  windows: "Win",
  macos: "Mac",
  linux: "Linux",
};

export function SetupHistoryPanel({ history, currentIds, currentPlatform, currentDistro, onSave, onLoad, onDelete }: Props) {
  const [name, setName] = useState("");

  const handleSave = () => {
    onSave(name || "");
    setName("");
  };

  return (
    <div className="space-y-3">
      <p className="text-[10px] uppercase tracking-widest font-semibold text-sidebar-foreground/40 px-1">
        Histórico de Setups
      </p>

      {/* Save current setup */}
      <div className="space-y-2">
        <Input
          placeholder="Nome do setup..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          className="h-7 text-xs bg-white/5 border-white/10 text-sidebar-foreground placeholder:text-sidebar-foreground/30 focus:border-blue-400/50"
        />
        <Button
          size="sm"
          onClick={handleSave}
          disabled={currentIds.length === 0}
          className="w-full h-7 text-xs gap-1.5 bg-white/10 text-sidebar-foreground hover:bg-white/20 border-0"
          variant="outline"
        >
          <Save className="h-3 w-3" />
          Salvar setup atual ({currentIds.length} apps)
        </Button>
      </div>

      {/* History list */}
      {history.length === 0 ? (
        <p className="text-[11px] text-sidebar-foreground/40 px-1">Nenhum setup salvo ainda.</p>
      ) : (
        <div className="space-y-1.5 max-h-56 overflow-y-auto scrollbar-thin pr-0.5">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-1.5 px-2 py-2 rounded-lg bg-white/5 group hover:bg-white/10 transition-colors"
            >
              <Clock className="h-3 w-3 text-sidebar-foreground/40 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate leading-tight">{entry.name}</p>
                <p className="text-[10px] text-sidebar-foreground/40 truncate leading-tight">
                  {platformLabel[entry.platform]} · {entry.selectedIds.length} apps · {formatDate(entry.date)}
                </p>
              </div>
              <button
                onClick={() => onLoad(entry)}
                className={cn(
                  "p-1 rounded text-sidebar-foreground/50 hover:text-blue-300 hover:bg-blue-500/20 transition-colors shrink-0",
                  "opacity-0 group-hover:opacity-100"
                )}
                title="Carregar setup"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
              <button
                onClick={() => onDelete(entry.id)}
                className={cn(
                  "p-1 rounded text-sidebar-foreground/50 hover:text-red-300 hover:bg-red-500/20 transition-colors shrink-0",
                  "opacity-0 group-hover:opacity-100"
                )}
                title="Excluir setup"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

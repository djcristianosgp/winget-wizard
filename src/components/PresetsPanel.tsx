import { Code, Server, Zap, Gamepad2, Briefcase, Package } from "lucide-react";
import { defaultPresets } from "@/data/apps";
import { cn } from "@/lib/utils";

const presetIcons: Record<string, React.ReactNode> = {
  Code: <Code className="h-3.5 w-3.5" />,
  Server: <Server className="h-3.5 w-3.5" />,
  Zap: <Zap className="h-3.5 w-3.5" />,
  Gamepad2: <Gamepad2 className="h-3.5 w-3.5" />,
  Briefcase: <Briefcase className="h-3.5 w-3.5" />,
  Package: <Package className="h-3.5 w-3.5" />,
};

interface Props {
  onApply: (appIds: string[]) => void;
}

export function PresetsPanel({ onApply }: Props) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] uppercase tracking-widest font-semibold text-sidebar-foreground/40 mb-2 px-1">
        Presets
      </p>
      {defaultPresets.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onApply(preset.appIds)}
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150",
            "text-sidebar-foreground/80 hover:bg-white/8 hover:text-white group"
          )}
          title={preset.description}
        >
          <span className="flex items-center justify-center h-6 w-6 rounded-md bg-white/10 text-sidebar-foreground/60 group-hover:bg-blue-500/30 group-hover:text-blue-300 transition-colors shrink-0">
            {presetIcons[preset.icon ?? "Package"] ?? <Package className="h-3.5 w-3.5" />}
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-xs font-medium truncate leading-tight">{preset.name}</span>
            <span className="block text-[10px] text-sidebar-foreground/50 truncate leading-tight mt-0.5">
              {preset.appIds.length} apps
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

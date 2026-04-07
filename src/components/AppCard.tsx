import type { WingetApp } from "@/data/apps";
import { categoryLabels } from "@/data/apps";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Globe, Code, Wrench, MessageCircle, Play } from "lucide-react";

const catIcons = {
  browsers: Globe,
  development: Code,
  utilities: Wrench,
  communication: MessageCircle,
  multimedia: Play,
};

interface Props {
  app: WingetApp;
  selected: boolean;
  onToggle: (id: string) => void;
}

export function AppCard({ app, selected, onToggle }: Props) {
  const Icon = catIcons[app.category];

  return (
    <button
      onClick={() => onToggle(app.id)}
      className={cn(
        "group relative flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 text-left w-full",
        selected
          ? "bg-secondary/10 border-secondary shadow-sm ring-1 ring-secondary/30"
          : "bg-card border-border hover:border-secondary/40 hover:shadow-md"
      )}
    >
      <div className={cn(
        "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
        selected ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground group-hover:bg-secondary/10 group-hover:text-secondary"
      )}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-card-foreground truncate">{app.name}</p>
        <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">{app.id}</p>
        <span className="inline-block mt-1.5 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {categoryLabels[app.category]}
        </span>
      </div>
      <Checkbox
        checked={selected}
        className="mt-1 pointer-events-none data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
      />
    </button>
  );
}

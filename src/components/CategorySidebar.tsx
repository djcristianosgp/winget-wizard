import { Globe, Code, Wrench, MessageCircle, Play, Layers } from "lucide-react";
import type { AppCategory } from "@/data/apps";
import { categoryLabels } from "@/data/apps";
import { cn } from "@/lib/utils";

const icons: Record<AppCategory | "all", React.ReactNode> = {
  all: <Layers className="h-4 w-4" />,
  browsers: <Globe className="h-4 w-4" />,
  development: <Code className="h-4 w-4" />,
  utilities: <Wrench className="h-4 w-4" />,
  communication: <MessageCircle className="h-4 w-4" />,
  multimedia: <Play className="h-4 w-4" />,
};

const categories: (AppCategory | "all")[] = ["all", "browsers", "development", "utilities", "communication", "multimedia"];

interface Props {
  active: AppCategory | "all";
  onSelect: (cat: AppCategory | "all") => void;
  counts: Record<string, number>;
}

export function CategorySidebar({ active, onSelect, counts }: Props) {
  return (
    <nav className="space-y-1">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
            active === cat
              ? "bg-secondary text-secondary-foreground shadow-sm"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          {icons[cat]}
          <span>{cat === "all" ? "Todos" : categoryLabels[cat]}</span>
          <span className={cn(
            "ml-auto text-xs px-2 py-0.5 rounded-full",
            active === cat ? "bg-primary/20 text-secondary-foreground" : "bg-sidebar-accent text-sidebar-foreground"
          )}>
            {counts[cat] || 0}
          </span>
        </button>
      ))}
    </nav>
  );
}

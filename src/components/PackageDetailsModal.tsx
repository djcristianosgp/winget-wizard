import type { SetupApp } from "@/data/apps";
import { categoryLabels } from "@/data/apps";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Globe, Code, Wrench, MessageCircle, Play, Plus, Minus } from "lucide-react";

const catIcons = {
  browsers: Globe,
  development: Code,
  utilities: Wrench,
  communication: MessageCircle,
  multimedia: Play,
};

const catColors: Record<string, string> = {
  browsers: "bg-blue-100 text-blue-600",
  development: "bg-violet-100 text-violet-600",
  utilities: "bg-amber-100 text-amber-600",
  communication: "bg-green-100 text-green-600",
  multimedia: "bg-rose-100 text-rose-600",
};

interface PackageManagerRow {
  label: string;
  value: string | undefined;
}

interface Props {
  app: SetupApp | null;
  open: boolean;
  selected: boolean;
  onClose: () => void;
  onToggle: (id: string) => void;
}

export function PackageDetailsModal({ app, open, selected, onClose, onToggle }: Props) {
  if (!app) return null;

  const Icon = catIcons[app.category];
  const iconColor = catColors[app.category] ?? "bg-muted text-muted-foreground";

  const packageManagers: PackageManagerRow[] = [
    { label: "Winget", value: app.winget },
    { label: "Homebrew", value: app.brew },
    { label: "APT (Ubuntu/Debian)", value: app.apt },
    { label: "DNF (Fedora)", value: app.dnf },
    { label: "Pacman (Arch)", value: app.pacman },
    { label: "Flatpak", value: app.flatpak },
    { label: "Nix", value: app.nix },
  ].filter((pm): pm is { label: string; value: string } => Boolean(pm.value));

  const handleToggle = () => {
    onToggle(app.id);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
              iconColor
            )}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base font-semibold leading-tight">
                {app.name}
              </DialogTitle>
              <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">{app.id}</p>
            </div>
          </div>
          <DialogDescription asChild>
            <div className="space-y-3 pt-1">
              {app.description && (
                <p className="text-sm text-foreground/80">{app.description}</p>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-[11px]">
                  {categoryLabels[app.category]}
                </Badge>
                {app.version && (
                  <Badge variant="outline" className="text-[11px]">
                    v{app.version}
                  </Badge>
                )}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        {packageManagers.length > 0 && (
          <div className="mt-2">
            <p className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground mb-2">
              Gerenciadores de pacotes disponíveis
            </p>
            <div className="space-y-1.5 rounded-lg border border-border/60 bg-muted/30 p-3">
              {packageManagers.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-medium text-muted-foreground text-xs w-36 shrink-0">{label}</span>
                  <code className="text-xs font-mono bg-background border border-border/60 rounded px-2 py-0.5 truncate max-w-full">
                    {value}
                  </code>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleToggle}
            variant={selected ? "outline" : "default"}
            className={cn(
              "gap-2",
              selected
                ? "border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            {selected ? (
              <>
                <Minus className="h-4 w-4" />
                Remover da fila
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Adicionar à fila
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

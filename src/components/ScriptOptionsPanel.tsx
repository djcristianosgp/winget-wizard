import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ScriptOptions } from "@/hooks/useQuickSetup";

interface Props {
  options: ScriptOptions;
  onChange: (opts: ScriptOptions) => void;
}

export function ScriptOptionsPanel({ options, onChange }: Props) {
  const update = (partial: Partial<ScriptOptions>) => onChange({ ...options, ...partial });

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Opções do Script</h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="silent" className="text-xs text-muted-foreground">Instalação silenciosa</Label>
          <Switch id="silent" checked={options.silent} onCheckedChange={(v) => update({ silent: v })} />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="accept" className="text-xs text-muted-foreground">Aceitar termos</Label>
          <Switch id="accept" checked={options.acceptAgreements} onCheckedChange={(v) => update({ acceptAgreements: v })} />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="nointeract" className="text-xs text-muted-foreground">Sem interação</Label>
          <Switch id="nointeract" checked={options.disableInteractivity} onCheckedChange={(v) => update({ disableInteractivity: v })} />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Escopo</Label>
        <div className="flex gap-1">
          {(["none", "user", "machine"] as const).map((s) => (
            <button
              key={s}
              onClick={() => update({ scope: s })}
              className={`flex-1 text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                options.scope === s
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s === "none" ? "Padrão" : s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="version" className="text-xs text-muted-foreground">Versão específica</Label>
        <Input
          id="version"
          placeholder="ex: 1.0.0"
          value={options.version}
          onChange={(e) => update({ version: e.target.value })}
          className="h-8 text-xs"
        />
      </div>
    </div>
  );
}

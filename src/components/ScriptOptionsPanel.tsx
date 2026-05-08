import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScriptOptions } from "@/hooks/useQuickSetup";
import type { PackageManager } from "@/data/apps";

interface Props {
  options: ScriptOptions;
  packageManager: PackageManager;
  onChange: (opts: ScriptOptions) => void;
}

export function ScriptOptionsPanel({ options, packageManager, onChange }: Props) {
  const update = (partial: Partial<ScriptOptions>) => onChange({ ...options, ...partial });
  const isWindows = packageManager === "winget";
  const isLinux = packageManager === "apt" || packageManager === "dnf" || packageManager === "pacman";
  const isFlatpak = packageManager === "flatpak";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Settings className="h-3.5 w-3.5 text-sidebar-foreground/60" />
        <h3 className="text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/60">
          Configurações de instalação
        </h3>
      </div>

      {isWindows && <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Label htmlFor="silent" className="text-xs font-medium text-sidebar-foreground cursor-pointer">
              Instalação silenciosa
            </Label>
            <p className="text-[10px] text-sidebar-foreground/50 mt-0.5">Oculta janelas e prompts</p>
          </div>
          <Switch
            id="silent"
            checked={options.silent}
            onCheckedChange={(v) => update({ silent: v })}
            className="mt-0.5 shrink-0"
          />
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Label htmlFor="accept" className="text-xs font-medium text-sidebar-foreground cursor-pointer">
              Aceitar termos automaticamente
            </Label>
            <p className="text-[10px] text-sidebar-foreground/50 mt-0.5">Aceita licenças sem confirmação</p>
          </div>
          <Switch
            id="accept"
            checked={options.acceptAgreements}
            onCheckedChange={(v) => update({ acceptAgreements: v })}
            className="mt-0.5 shrink-0"
          />
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Label htmlFor="nointeract" className="text-xs font-medium text-sidebar-foreground cursor-pointer">
              Sem interação do usuário
            </Label>
            <p className="text-[10px] text-sidebar-foreground/50 mt-0.5">Desabilita prompts interativos</p>
          </div>
          <Switch
            id="nointeract"
            checked={options.disableInteractivity}
            onCheckedChange={(v) => update({ disableInteractivity: v })}
            className="mt-0.5 shrink-0"
          />
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Label htmlFor="wingetbootstrap" className="text-xs font-medium text-sidebar-foreground cursor-pointer">
              Instalar winget se não existir (Windows)
            </Label>
            <p className="text-[10px] text-sidebar-foreground/50 mt-0.5">Adiciona comando para instalar o winget automaticamente</p>
          </div>
          <Switch
            id="wingetbootstrap"
            checked={options.installWingetIfMissing}
            onCheckedChange={(v) => update({ installWingetIfMissing: v })}
            className="mt-0.5 shrink-0"
          />
        </div>
      </div>}

      {isWindows && <div className="space-y-2 pt-1">
        <Label className="text-xs font-medium text-sidebar-foreground">Escopo de instalação</Label>
        <p className="text-[10px] text-sidebar-foreground/50">Define onde os apps serão instalados</p>
        <div className="flex gap-1 mt-1.5">
          {(["none", "user", "machine"] as const).map((s) => (
            <button
              key={s}
              onClick={() => update({ scope: s })}
              className={cn(
                "flex-1 text-xs px-2 py-1.5 rounded-md font-medium transition-all duration-150",
                options.scope === s
                  ? "bg-white/20 text-white shadow-sm"
                  : "bg-white/5 text-sidebar-foreground/70 hover:bg-white/10 hover:text-sidebar-foreground"
              )}
            >
              {s === "none" ? "Padrão" : s === "user" ? "Usuário" : "Sistema"}
            </button>
          ))}
        </div>
      </div>}

      {isWindows && <div className="space-y-1.5 pt-1">
        <Label htmlFor="version" className="text-xs font-medium text-sidebar-foreground">
          Versão específica
        </Label>
        <p className="text-[10px] text-sidebar-foreground/50">Deixe vazio para usar a mais recente</p>
        <Input
          id="version"
          placeholder="ex: 1.0.0"
          value={options.version}
          onChange={(e) => update({ version: e.target.value })}
          className="h-8 text-xs mt-1.5 bg-white/5 border-white/10 text-sidebar-foreground placeholder:text-sidebar-foreground/30 focus:border-blue-400/50"
        />
      </div>}

      {isLinux && (
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <Label htmlFor="linuxauto" className="text-xs font-medium text-sidebar-foreground cursor-pointer">
                Confirmação automática
              </Label>
              <p className="text-[10px] text-sidebar-foreground/50 mt-0.5">Usa flags para instalar sem confirmação manual</p>
            </div>
            <Switch
              id="linuxauto"
              checked={options.linuxAutoYes}
              onCheckedChange={(v) => update({ linuxAutoYes: v })}
              className="mt-0.5 shrink-0"
            />
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <Label htmlFor="linuxsudo" className="text-xs font-medium text-sidebar-foreground cursor-pointer">
                Prefixar com sudo
              </Label>
              <p className="text-[10px] text-sidebar-foreground/50 mt-0.5">Necessário na maioria das instalações de sistema</p>
            </div>
            <Switch
              id="linuxsudo"
              checked={options.linuxUseSudo}
              onCheckedChange={(v) => update({ linuxUseSudo: v })}
              className="mt-0.5 shrink-0"
            />
          </div>
        </div>
      )}

      {!isWindows && !isLinux && !isFlatpak && packageManager !== "nix" && (
        <p className="text-[11px] text-sidebar-foreground/60 bg-white/5 rounded-md px-3 py-2 border border-white/10">
          Homebrew usa modo simples. Sem opções adicionais nesta etapa.
        </p>
      )}

      {packageManager === "nix" && (
        <p className="text-[11px] text-sidebar-foreground/60 bg-white/5 rounded-md px-3 py-2 border border-white/10">
          Nix gera um arquivo <span className="font-mono">shell.nix</span> declarativo. Use <span className="font-mono">nix-shell shell.nix</span> para ativar o ambiente.
        </p>
      )}

      {isFlatpak && (
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <Label htmlFor="linuxauto" className="text-xs font-medium text-sidebar-foreground cursor-pointer">
                Confirmação automática
              </Label>
              <p className="text-[10px] text-sidebar-foreground/50 mt-0.5">Instala sem confirmação manual (-y)</p>
            </div>
            <Switch
              id="linuxauto"
              checked={options.linuxAutoYes}
              onCheckedChange={(v) => update({ linuxAutoYes: v })}
              className="mt-0.5 shrink-0"
            />
          </div>
        </div>
      )}
    </div>
  );
}

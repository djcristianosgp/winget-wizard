import { useMemo, useState } from "react";
import { RefreshCw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { LinuxDistro, OSPlatform } from "@/data/apps";
import {
  buildUpgradeCommand,
  buildUpgradeScript,
  getUpgradePackageManager,
  getUpgradeScriptFilename,
  type UpgradeOptions,
} from "@/lib/upgrade";
import { toast } from "sonner";

interface Props {
  platform: OSPlatform;
  linuxDistro: LinuxDistro;
  onPlatformChange: (platform: OSPlatform) => void;
  onLinuxDistroChange: (distro: LinuxDistro) => void;
}

const defaultOptions: UpgradeOptions = {
  updateAll: true,
  packageId: "",
  dryRun: false,
  autoConfirm: true,
  useSudo: true,
  wingetIncludeUnknown: true,
  wingetAcceptAgreements: true,
  wingetDisableInteractivity: false,
  includeCleanup: false,
};

export function UpgradeTab({ platform, linuxDistro, onPlatformChange, onLinuxDistroChange }: Props) {
  const [options, setOptions] = useState<UpgradeOptions>(defaultOptions);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const packageManager = useMemo(() => getUpgradePackageManager(platform, linuxDistro), [platform, linuxDistro]);
  const isLinux = packageManager === "apt" || packageManager === "dnf" || packageManager === "pacman";
  const isWinget = packageManager === "winget";
  const upgradeCommand = useMemo(() => buildUpgradeCommand(packageManager, options), [packageManager, options]);
  const upgradeScript = useMemo(
    () => buildUpgradeScript(packageManager, upgradeCommand, options.includeCleanup, options.useSudo),
    [packageManager, upgradeCommand, options.includeCleanup, options.useSudo]
  );

  const copy = async (text: string, which: "command" | "script") => {
    await navigator.clipboard.writeText(text);
    toast.success("Comando copiado!");
    if (which === "command") {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } else {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  const downloadScript = () => {
    if (!upgradeScript) return;
    const blob = new Blob([upgradeScript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = getUpgradeScriptFilename(packageManager);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-6 bg-card rounded-xl border animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-secondary" />
          Atualizar Aplicativos
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Gere comandos e scripts de atualização para Windows, macOS e Linux.</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Plataforma</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant={platform === "windows" ? "default" : "outline"} onClick={() => onPlatformChange("windows")}>Windows</Button>
          <Button size="sm" variant={platform === "macos" ? "default" : "outline"} onClick={() => onPlatformChange("macos")}>macOS</Button>
          <Button size="sm" variant={platform === "linux" ? "default" : "outline"} onClick={() => onPlatformChange("linux")}>Linux</Button>
        </div>
        {platform === "linux" && (
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant={linuxDistro === "apt" ? "default" : "outline"} onClick={() => onLinuxDistroChange("apt")}>apt</Button>
            <Button size="sm" variant={linuxDistro === "dnf" ? "default" : "outline"} onClick={() => onLinuxDistroChange("dnf")}>dnf</Button>
            <Button size="sm" variant={linuxDistro === "pacman" ? "default" : "outline"} onClick={() => onLinuxDistroChange("pacman")}>pacman</Button>
          </div>
        )}
      </div>

      <div className="space-y-3 border rounded-lg p-4">
        <h3 className="text-sm font-semibold">Parâmetros avançados</h3>
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="upgrade-all" className="cursor-pointer">Atualizar todos os pacotes</Label>
          <Switch id="upgrade-all" checked={options.updateAll} onCheckedChange={(v) => setOptions((prev) => ({ ...prev, updateAll: v }))} />
        </div>
        {!options.updateAll && (
          <div className="space-y-1.5">
            <Label htmlFor="package-id">Pacote específico</Label>
            <Input
              id="package-id"
              placeholder={isWinget ? "Ex: Google.Chrome" : packageManager === "brew" ? "Ex: git" : "Ex: firefox"}
              value={options.packageId}
              onChange={(e) => setOptions((prev) => ({ ...prev, packageId: e.target.value }))}
              className="font-mono text-sm"
            />
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="dry-run" className="cursor-pointer">Simular atualização (dry-run)</Label>
          <Switch id="dry-run" checked={options.dryRun} onCheckedChange={(v) => setOptions((prev) => ({ ...prev, dryRun: v }))} />
        </div>
        {isLinux && (
          <>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="use-sudo" className="cursor-pointer">Usar sudo</Label>
              <Switch id="use-sudo" checked={options.useSudo} onCheckedChange={(v) => setOptions((prev) => ({ ...prev, useSudo: v }))} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="auto-confirm" className="cursor-pointer">Confirmação automática</Label>
              <Switch id="auto-confirm" checked={options.autoConfirm} onCheckedChange={(v) => setOptions((prev) => ({ ...prev, autoConfirm: v }))} />
            </div>
          </>
        )}
        {isWinget && (
          <>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="include-unknown" className="cursor-pointer">Incluir pacotes com versão desconhecida</Label>
              <Switch id="include-unknown" checked={options.wingetIncludeUnknown} onCheckedChange={(v) => setOptions((prev) => ({ ...prev, wingetIncludeUnknown: v }))} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="accept-agreements" className="cursor-pointer">Aceitar acordos automaticamente</Label>
              <Switch id="accept-agreements" checked={options.wingetAcceptAgreements} onCheckedChange={(v) => setOptions((prev) => ({ ...prev, wingetAcceptAgreements: v }))} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="disable-interactivity" className="cursor-pointer">Desativar interatividade</Label>
              <Switch id="disable-interactivity" checked={options.wingetDisableInteractivity} onCheckedChange={(v) => setOptions((prev) => ({ ...prev, wingetDisableInteractivity: v }))} />
            </div>
          </>
        )}
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="cleanup" className="cursor-pointer">Adicionar limpeza pós-upgrade no script</Label>
          <Switch id="cleanup" checked={options.includeCleanup} onCheckedChange={(v) => setOptions((prev) => ({ ...prev, includeCleanup: v }))} />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Comando gerado ({packageManager})</h3>
        <pre className="bg-primary text-primary-foreground text-sm p-4 rounded-lg font-mono">
          {upgradeCommand || "Informe um pacote específico para gerar o comando."}
        </pre>
        <Button size="sm" disabled={!upgradeCommand} onClick={() => copy(upgradeCommand, "command")} className="gap-1.5 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          {copiedAll ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copiedAll ? "Copiado" : "Copiar comando"}
        </Button>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Script completo</h3>
        <pre className="bg-primary text-primary-foreground text-sm p-4 rounded-lg font-mono whitespace-pre-wrap">
          {upgradeScript || "Nenhum script gerado."}
        </pre>
        <div className="flex items-center gap-2">
          <Button size="sm" disabled={!upgradeScript} onClick={() => copy(upgradeScript, "script")} className="gap-1.5 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            {copiedScript ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copiedScript ? "Copiado" : "Copiar script"}
          </Button>
          <Button size="sm" variant="outline" disabled={!upgradeScript} onClick={downloadScript}>
            Baixar script
          </Button>
        </div>
      </div>
    </div>
  );
}

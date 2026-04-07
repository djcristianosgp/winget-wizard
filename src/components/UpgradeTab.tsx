import { useState } from "react";
import { RefreshCw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function UpgradeTab() {
  const [specificApp, setSpecificApp] = useState("");
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedSpecific, setCopiedSpecific] = useState(false);

  const upgradeAllCmd = "winget upgrade --all";
  const upgradeSpecificCmd = specificApp.trim()
    ? `winget upgrade --id ${specificApp.trim()}`
    : "";

  const copy = async (text: string, which: "all" | "specific") => {
    await navigator.clipboard.writeText(text);
    toast.success("Comando copiado!");
    if (which === "all") {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } else {
      setCopiedSpecific(true);
      setTimeout(() => setCopiedSpecific(false), 2000);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-card rounded-xl border animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-secondary" />
          Atualizar Aplicativos
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Gere comandos para atualizar seus aplicativos via Winget.</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Atualizar todos</h3>
        <pre className="bg-primary text-primary-foreground text-sm p-4 rounded-lg font-mono">
          {upgradeAllCmd}
        </pre>
        <Button size="sm" onClick={() => copy(upgradeAllCmd, "all")} className="gap-1.5 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          {copiedAll ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copiedAll ? "Copiado" : "Copiar comando"}
        </Button>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Atualizar app específico</h3>
        <Input
          placeholder="Ex: Google.Chrome"
          value={specificApp}
          onChange={(e) => setSpecificApp(e.target.value)}
          className="font-mono text-sm"
        />
        {upgradeSpecificCmd && (
          <>
            <pre className="bg-primary text-primary-foreground text-sm p-4 rounded-lg font-mono">
              {upgradeSpecificCmd}
            </pre>
            <Button size="sm" onClick={() => copy(upgradeSpecificCmd, "specific")} className="gap-1.5 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              {copiedSpecific ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedSpecific ? "Copiado" : "Copiar comando"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

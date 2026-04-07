import { useState, useRef } from "react";
import { Copy, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  script: string;
  scriptBat: string;
  scriptPs1: string;
  count: number;
}

export function ScriptPreview({ script, scriptBat, scriptPs1, count }: Props) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const copy = async () => {
    await navigator.clipboard.writeText(script);
    setCopied(true);
    toast.success("Script copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const download = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filename} baixado!`);
  };

  if (!script) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Copy className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">Selecione aplicativos para<br />gerar o script</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Script <span className="text-muted-foreground font-normal">({count} apps)</span>
        </h3>
      </div>

      <pre
        ref={preRef}
        className="bg-primary text-primary-foreground text-xs p-4 rounded-lg overflow-auto max-h-64 scrollbar-thin font-mono leading-relaxed"
      >
        {script}
      </pre>

      <div className="grid grid-cols-3 gap-2">
        <Button size="sm" onClick={copy} className="text-xs gap-1.5 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copiado" : "Copiar"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => download(scriptBat, "quicksetup.bat")} className="text-xs gap-1.5">
          <Download className="h-3.5 w-3.5" />.bat
        </Button>
        <Button size="sm" variant="outline" onClick={() => download(scriptPs1, "quicksetup.ps1")} className="text-xs gap-1.5">
          <Download className="h-3.5 w-3.5" />.ps1
        </Button>
      </div>
    </div>
  );
}

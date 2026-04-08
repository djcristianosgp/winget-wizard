import { useState, useRef } from "react";
import { Copy, Download, Check, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { PackageManager } from "@/data/apps";

interface Props {
  script: string;
  scriptBat: string;
  scriptPs1: string;
  scriptSh: string;
  packageManager: PackageManager;
  count: number;
}

export function ScriptPreview({ script, scriptBat, scriptPs1, scriptSh, packageManager, count }: Props) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);
  const isWindows = packageManager === "winget";
  const terminalFile = isWindows ? "quicksetup.ps1" : "quicksetup.sh";

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
      <div className="flex flex-col items-center justify-center py-14 text-center px-4">
        <div className="h-14 w-14 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center mb-4 shadow-inner">
          <Terminal className="h-6 w-6 text-gray-500" />
        </div>
        <p className="text-sm font-medium text-gray-400 leading-relaxed">
          Selecione aplicativos para<br />gerar seu script
        </p>
        <p className="text-xs text-gray-600 mt-2">O script aparecerá aqui</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Terminal header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-green-400" />
          <span className="text-sm font-semibold text-gray-200">Script gerado</span>
          <span className="text-xs bg-gray-700 text-green-400 font-mono px-2 py-0.5 rounded-full border border-gray-600">
            {count} {count === 1 ? "app" : "apps"}
          </span>
        </div>
        <button
          onClick={copy}
          className={cn(
            "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium transition-all duration-200",
            copied
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600 hover:text-white"
          )}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copiado!" : "Copiar"}
        </button>
      </div>

      {/* Terminal window */}
      <div className="relative rounded-xl overflow-hidden border border-gray-700 shadow-xl">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-800 border-b border-gray-700">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-gray-500 font-mono">{terminalFile}</span>
        </div>
        <pre
          ref={preRef}
          className="bg-gray-900 text-green-400 text-xs p-5 overflow-auto max-h-72 scrollbar-thin font-mono leading-relaxed whitespace-pre-wrap"
        >
          {script}
        </pre>
      </div>

      {/* Actions */}
      {isWindows ? (
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => download(scriptBat, "quicksetup.bat")}
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-600"
          >
            <Download className="h-3.5 w-3.5" />
            Baixar .bat
          </Button>
          <Button
            onClick={() => download(scriptPs1, "quicksetup.ps1")}
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-600"
          >
            <Download className="h-3.5 w-3.5" />
            Baixar .ps1
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => download(scriptSh, "quicksetup.sh")}
          variant="outline"
          size="sm"
          className="w-full text-xs gap-1.5 border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-600"
        >
          <Download className="h-3.5 w-3.5" />
          Baixar .sh
        </Button>
      )}

      <Button
        onClick={copy}
        size="sm"
        className={cn(
          "w-full text-sm font-semibold gap-2 transition-all duration-200",
          copied
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-900/40"
        )}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Script Copiado!" : "Copiar Script"}
      </Button>
    </div>
  );
}

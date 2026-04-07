import { useState, useMemo } from "react";
import { Search, CheckSquare, XSquare, Package, RefreshCw, Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategorySidebar } from "@/components/CategorySidebar";
import { AppCard } from "@/components/AppCard";
import { ScriptPreview } from "@/components/ScriptPreview";
import { ScriptOptionsPanel } from "@/components/ScriptOptionsPanel";
import { UpgradeTab } from "@/components/UpgradeTab";
import { useQuickSetup } from "@/hooks/useQuickSetup";
import { apps } from "@/data/apps";
import type { AppCategory } from "@/data/apps";
import logo from "@/assets/logo.png";

type Tab = "install" | "upgrade";

export default function QuickSetupApp() {
  const qs = useQuickSetup();
  const [tab, setTab] = useState<Tab>("install");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: apps.length };
    for (const a of apps) c[a.category] = (c[a.category] || 0) + 1;
    return c;
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-sidebar flex flex-col transform transition-transform duration-300
        lg:static lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <img src={logo} alt="QuickSetup" className="h-8 w-8" width={32} height={32} />
          <span className="text-lg font-bold text-sidebar-primary-foreground tracking-tight">QuickSetup</span>
          <button className="ml-auto lg:hidden text-sidebar-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-3">
          <button
            onClick={() => setTab("install")}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              tab === "install"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            }`}
          >
            <Package className="h-3.5 w-3.5" /> Instalar
          </button>
          <button
            onClick={() => setTab("upgrade")}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              tab === "upgrade"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            }`}
          >
            <RefreshCw className="h-3.5 w-3.5" /> Atualizar
          </button>
        </div>

        {tab === "install" && (
          <>
            <div className="px-4 pt-2 pb-3">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-sidebar-foreground/60 mb-3">Categorias</p>
              <CategorySidebar active={qs.activeCategory} onSelect={(c) => { qs.setActiveCategory(c); setSidebarOpen(false); }} counts={counts} />
            </div>

            <div className="mt-auto border-t border-sidebar-border p-4">
              <ScriptOptionsPanel options={qs.options} onChange={qs.setOptions} />
            </div>
          </>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b px-4 lg:px-6 py-3 flex items-center gap-3">
          <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>

          {tab === "install" && (
            <>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar aplicativos..."
                  value={qs.search}
                  onChange={(e) => qs.setSearch(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>

              <div className="hidden sm:flex items-center gap-2 ml-auto">
                <Button size="sm" variant="outline" onClick={qs.selectAll} className="text-xs gap-1.5">
                  <CheckSquare className="h-3.5 w-3.5" /> Selecionar todos
                </Button>
                <Button size="sm" variant="ghost" onClick={qs.clearSelection} className="text-xs gap-1.5">
                  <XSquare className="h-3.5 w-3.5" /> Limpar
                </Button>
              </div>

              {qs.selectedApps.length > 0 && (
                <div className="flex items-center gap-1.5 bg-secondary/10 text-secondary px-3 py-1.5 rounded-full">
                  <Zap className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold">{qs.selectedApps.length} selecionados</span>
                </div>
              )}
            </>
          )}

          {tab === "upgrade" && (
            <h1 className="text-lg font-bold flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-secondary" /> Atualizar Aplicativos
            </h1>
          )}
        </header>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {tab === "install" ? (
            <>
              {/* App Grid */}
              <main className="flex-1 overflow-auto p-4 lg:p-6 scrollbar-thin">
                {qs.filteredApps.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                    <Search className="h-12 w-12 text-muted-foreground/40 mb-4" />
                    <p className="text-muted-foreground">Nenhum aplicativo encontrado</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
                    {qs.filteredApps.map((app) => (
                      <AppCard
                        key={app.id}
                        app={app}
                        selected={qs.selectedIds.has(app.id)}
                        onToggle={qs.toggleApp}
                      />
                    ))}
                  </div>
                )}
              </main>

              {/* Script Panel */}
              <aside className="hidden lg:block w-80 xl:w-96 border-l bg-card/50 p-5 overflow-auto scrollbar-thin">
                <ScriptPreview
                  script={qs.script}
                  scriptBat={qs.scriptBat}
                  scriptPs1={qs.scriptPs1}
                  count={qs.selectedApps.length}
                />
              </aside>
            </>
          ) : (
            <main className="flex-1 overflow-auto p-4 lg:p-6 max-w-2xl">
              <UpgradeTab />
            </main>
          )}
        </div>

        {/* Mobile script panel */}
        {tab === "install" && qs.selectedApps.length > 0 && (
          <div className="lg:hidden border-t bg-card p-4">
            <ScriptPreview
              script={qs.script}
              scriptBat={qs.scriptBat}
              scriptPs1={qs.scriptPs1}
              count={qs.selectedApps.length}
            />
          </div>
        )}
      </div>
    </div>
  );
}

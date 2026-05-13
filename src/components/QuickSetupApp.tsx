import { useState, useMemo } from "react";
import { Search, CheckSquare, XSquare, Package, RefreshCw, Menu, X, Zap, Loader2, Copy, Check, Monitor, Apple, Terminal, Share2, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategorySidebar } from "@/components/CategorySidebar";
import { AppCard } from "@/components/AppCard";
import { ScriptPreview } from "@/components/ScriptPreview";
import { ScriptOptionsPanel } from "@/components/ScriptOptionsPanel";
import { PresetsPanel } from "@/components/PresetsPanel";
import { SetupHistoryPanel } from "@/components/SetupHistoryPanel";
import { UpgradeTab } from "@/components/UpgradeTab";
import { OsCatalogTab } from "@/components/OsCatalogTab";
import { Footer } from "@/components/Footer";
import { SupportButton } from "@/components/SupportButton";
import { useQuickSetup } from "@/hooks/useQuickSetup";
import { useSetupHistory, type SetupEntry } from "@/hooks/useSetupHistory";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

type Tab = "install" | "upgrade" | "os-catalog";

export default function QuickSetupApp() {
  const qs = useQuickSetup();
  const { history, saveSetup, deleteSetup } = useSetupHistory();
  const [tab, setTab] = useState<Tab>("install");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [barCopied, setBarCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const counts = useMemo(() => {
    const available = qs.sourceApps.filter((a) => qs.isAppAvailable(a));
    const c: Record<string, number> = { all: available.length };
    for (const a of available) c[a.category] = (c[a.category] || 0) + 1;
    return c;
  }, [qs.sourceApps, qs.isAppAvailable]);

  const SUPPORT_CTA_DELAY_MS = 800;

  const showSupportCTA = () => {
    setTimeout(() => {
      toast("QuickSetup economizou seu tempo? ❤️", {
        description: "Considere apoiar o projeto para mantê-lo vivo!",
        duration: 5000,
      });
    }, SUPPORT_CTA_DELAY_MS);
  };

  const handleBarCopy = async () => {
    await navigator.clipboard.writeText(qs.script);
    setBarCopied(true);
    toast.success("Script copiado!");
    setTimeout(() => setBarCopied(false), 2000);
    showSupportCTA();
  };

  const handleShare = async () => {
    const url = qs.getShareURL();
    await navigator.clipboard.writeText(url);
    setShareCopied(true);
    toast.success("Link de compartilhamento copiado!");
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleSaveHistory = (name: string) => {
    saveSetup(name, Array.from(qs.selectedIds), qs.platform, qs.linuxDistro);
    toast.success("Setup salvo no histórico!");
  };

  const handleLoadHistory = (entry: SetupEntry) => {
    qs.loadSetup(entry.selectedIds, entry.platform, entry.linuxDistro);
    toast.success(`Setup "${entry.name}" carregado!`);
  };

  return (
    <div className={`min-h-screen bg-background flex flex-col${tab === "install" && qs.selectedApps.length > 0 ? " pb-20" : ""}`}>
      <div className="flex flex-1">
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
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <img src={logo} alt="QuickSetup" className="h-6 w-6" width={24} height={24} />
          </div>
          <div>
            <span className="text-sm font-bold text-white tracking-tight block leading-none">QuickSetup</span>
            <span className="text-[10px] text-sidebar-foreground/50 leading-none mt-0.5 block">Winget Wizard</span>
          </div>
          <button className="ml-auto lg:hidden text-sidebar-foreground/60 hover:text-white transition-colors" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-3 pb-0 flex-wrap">
          <button
            onClick={() => setTab("install")}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
              tab === "install"
                ? "bg-blue-500/20 text-blue-300 shadow-inner"
                : "text-sidebar-foreground/70 hover:bg-white/8 hover:text-sidebar-foreground"
            }`}
          >
            <Package className="h-3.5 w-3.5" /> Instalar
          </button>
          <button
            onClick={() => setTab("upgrade")}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
              tab === "upgrade"
                ? "bg-blue-500/20 text-blue-300 shadow-inner"
                : "text-sidebar-foreground/70 hover:bg-white/8 hover:text-sidebar-foreground"
            }`}
          >
            <RefreshCw className="h-3.5 w-3.5" /> Atualizar
          </button>
          <button
            onClick={() => setTab("os-catalog")}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
              tab === "os-catalog"
                ? "bg-blue-500/20 text-blue-300 shadow-inner"
                : "text-sidebar-foreground/70 hover:bg-white/8 hover:text-sidebar-foreground"
            }`}
          >
            <HardDrive className="h-3.5 w-3.5" /> S.O.
          </button>
        </div>

        {tab === "install" && (
          <>
            <div className="px-4 pt-4 pb-3 flex-1 overflow-y-auto scrollbar-thin space-y-5">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-semibold text-sidebar-foreground/40 mb-2 px-1">Categorias</p>
                <CategorySidebar active={qs.activeCategory} onSelect={(c) => { qs.setActiveCategory(c); setSidebarOpen(false); }} counts={counts} />
              </div>

              <div className="border-t border-sidebar-border pt-4">
                <PresetsPanel onApply={(ids) => { qs.applyPreset(ids); setSidebarOpen(false); }} />
              </div>

              <div className="border-t border-sidebar-border pt-4 pb-1">
                <SetupHistoryPanel
                  history={history}
                  currentIds={Array.from(qs.selectedIds)}
                  currentPlatform={qs.platform}
                  currentDistro={qs.linuxDistro}
                  onSave={handleSaveHistory}
                  onLoad={(entry) => { handleLoadHistory(entry); setSidebarOpen(false); }}
                  onDelete={deleteSetup}
                />
              </div>
            </div>

            <div className="border-t border-sidebar-border p-4 shrink-0">
              <ScriptOptionsPanel options={qs.options} packageManager={qs.packageManager} onChange={qs.setOptions} />
            </div>
          </>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-border/60 px-4 lg:px-6 py-3 flex items-center gap-3 shadow-sm">
          <button className="lg:hidden text-muted-foreground hover:text-foreground transition-colors" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>

          {tab === "install" && (
            <>
              <div className="hidden md:flex items-center gap-1 rounded-xl bg-muted/50 border border-border/60 p-1">
                <button
                  onClick={() => qs.setPlatform("windows")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    qs.platform === "windows" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Monitor className="h-3.5 w-3.5" /> Windows
                </button>
                <button
                  onClick={() => qs.setPlatform("macos")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    qs.platform === "macos" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Apple className="h-3.5 w-3.5" /> MacOS
                </button>
                <button
                  onClick={() => qs.setPlatform("linux")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    qs.platform === "linux" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5" /> Linux
                </button>
              </div>

              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder={
                    qs.platform === "windows"
                      ? "Buscar aplicativos (ex: Chrome, Git, VSCode)..."
                      : qs.platform === "macos"
                        ? "Buscar aplicativos (ex: git, node, firefox)..."
                        : qs.linuxDistro === "flatpak"
                          ? "Buscar no Flathub (ex: VLC, GIMP, Discord)..."
                          : qs.linuxDistro === "nix"
                            ? "Buscar pacotes Nix por nome..."
                            : "Buscar aplicativos locais por nome..."
                  }
                  value={qs.search}
                  onChange={(e) => qs.setSearch(e.target.value)}
                  className="pl-10 h-9 text-sm bg-muted/40 border-border/60 focus:bg-white transition-colors"
                />
              </div>

              {qs.platform === "linux" && (
                <div className="hidden xl:flex items-center gap-1 rounded-xl bg-muted/50 border border-border/60 p-1">
                  <button
                    onClick={() => qs.setLinuxDistro("apt")}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      qs.linuxDistro === "apt" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Ubuntu/Debian (apt)
                  </button>
                  <button
                    onClick={() => qs.setLinuxDistro("dnf")}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      qs.linuxDistro === "dnf" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Fedora (dnf)
                  </button>
                  <button
                    onClick={() => qs.setLinuxDistro("pacman")}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      qs.linuxDistro === "pacman" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Arch (pacman)
                  </button>
                  <button
                    onClick={() => qs.setLinuxDistro("flatpak")}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      qs.linuxDistro === "flatpak" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Flatpak
                  </button>
                  <button
                    onClick={() => qs.setLinuxDistro("nix")}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      qs.linuxDistro === "nix" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Nix
                  </button>
                </div>
              )}

              <div className="hidden sm:flex items-center gap-2 ml-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={qs.selectAll}
                  className="text-xs gap-1.5 h-8 border-border/60 hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  <CheckSquare className="h-3.5 w-3.5" />
                  Selecionar todos
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={qs.clearSelection}
                  className="text-xs gap-1.5 h-8 text-muted-foreground hover:text-foreground"
                >
                  <XSquare className="h-3.5 w-3.5" />
                  Limpar
                </Button>
              </div>

              {qs.selectedApps.length > 0 && (
                <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-full">
                  <Zap className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold">{qs.selectedApps.length} selecionados</span>
                </div>
              )}
            </>
          )}

          {tab === "upgrade" && (
            <h1 className="text-base font-bold flex items-center gap-2 text-foreground">
              <RefreshCw className="h-4 w-4 text-blue-500" /> Atualizar Aplicativos
            </h1>
          )}

          {tab === "os-catalog" && (
            <h1 className="text-base font-bold flex items-center gap-2 text-foreground">
              <HardDrive className="h-4 w-4 text-blue-500" /> Catálogo de S.O.
            </h1>
          )}
        </header>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {tab === "install" ? (
            <>
              {/* App Grid */}
              <main className="flex-1 overflow-auto p-5 lg:p-6 scrollbar-thin bg-background">
                <p className="mb-4 text-xs text-muted-foreground bg-muted/50 border border-border/50 rounded-lg px-3 py-2 inline-flex items-center gap-2">
                  {qs.packageManager === "winget"
                    ? "Busca unificada: resultados locais e externos (winget.run). A fonte externa aparece com 2+ caracteres."
                    : qs.packageManager === "brew"
                      ? "Busca unificada: resultados locais e externos (Homebrew). A fonte externa aparece com 2+ caracteres."
                      : qs.packageManager === "flatpak"
                        ? "Busca unificada: resultados locais e externos (Flathub). A fonte externa aparece com 2+ caracteres."
                        : qs.packageManager === "nix"
                          ? "Gera shell.nix declarativo com os pacotes selecionados do catálogo Nixpkgs."
                          : "Busca local por catalogo da aplicacao para o sistema selecionado."}
                  {(qs.packageManager === "winget" || qs.packageManager === "brew" || qs.packageManager === "flatpak") && (
                    <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                      <RefreshCw className="h-3 w-3" />
                      Dados atualizados automaticamente
                    </span>
                  )}
                </p>

                {qs.platform === "linux" && (
                  <div className="mb-4 text-xs text-foreground bg-sky-50 border border-sky-200 rounded-lg px-3 py-2 inline-flex items-center gap-2">
                    <span className="font-semibold">Distribuição:</span>
                    <button onClick={() => qs.setLinuxDistro("apt")} className={`px-2 py-0.5 rounded ${qs.linuxDistro === "apt" ? "bg-sky-600 text-white" : "bg-white text-sky-700 border border-sky-200"}`}>Ubuntu/Debian (apt)</button>
                    <button onClick={() => qs.setLinuxDistro("dnf")} className={`px-2 py-0.5 rounded ${qs.linuxDistro === "dnf" ? "bg-sky-600 text-white" : "bg-white text-sky-700 border border-sky-200"}`}>Fedora (dnf)</button>
                    <button onClick={() => qs.setLinuxDistro("pacman")} className={`px-2 py-0.5 rounded ${qs.linuxDistro === "pacman" ? "bg-sky-600 text-white" : "bg-white text-sky-700 border border-sky-200"}`}>Arch (pacman)</button>
                    <button onClick={() => qs.setLinuxDistro("flatpak")} className={`px-2 py-0.5 rounded ${qs.linuxDistro === "flatpak" ? "bg-sky-600 text-white" : "bg-white text-sky-700 border border-sky-200"}`}>Flatpak</button>
                    <button onClick={() => qs.setLinuxDistro("nix")} className={`px-2 py-0.5 rounded ${qs.linuxDistro === "nix" ? "bg-sky-600 text-white" : "bg-white text-sky-700 border border-sky-200"}`}>Nix</button>
                  </div>
                )}

                {qs.remoteError && (
                  <div className="mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                    {qs.remoteError}
                  </div>
                )}

                {qs.filteredApps.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
                    <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4 border border-border/50">
                      <Search className="h-7 w-7 text-muted-foreground/40" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Nenhum aplicativo encontrado</p>
                    <p className="text-xs text-muted-foreground/60">Tente outro termo de busca</p>
                  </div>
                ) : (
                  <div className="space-y-7">
                    {qs.localFilteredApps.length > 0 && (
                      <section>
                        <div className="flex items-center gap-2 mb-3">
                          <h2 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Local</h2>
                          <span className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                            {qs.localFilteredApps.length}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2.5">
                          {qs.localFilteredApps.map((app) => (
                            <AppCard
                              key={app.id}
                              app={app}
                              selected={qs.selectedIds.has(app.id)}
                              available={qs.isAppAvailable(app)}
                              packageName={qs.getAppPackage(app)}
                              onToggle={qs.toggleApp}
                            />
                          ))}
                        </div>
                      </section>
                    )}

                    {(qs.packageManager === "winget" || qs.packageManager === "brew" || qs.packageManager === "flatpak") && <section>
                      <div className="flex items-center gap-2 mb-3">
                        <h2 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
                          {qs.packageManager === "brew" ? "Homebrew" : qs.packageManager === "flatpak" ? "Flathub" : "Externa"}
                        </h2>
                        {qs.remoteLoading
                          ? <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                          : qs.externalFilteredApps.length > 0 && (
                            <span className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                              {qs.externalFilteredApps.length}
                            </span>
                          )
                        }
                      </div>

                      {qs.search.trim().length < 2 ? (
                        <p className="text-sm text-muted-foreground bg-muted/40 border border-border/40 rounded-lg px-4 py-3 inline-block">
                          Digite pelo menos 2 caracteres para buscar na API.
                        </p>
                      ) : qs.remoteLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2.5">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-muted/20 animate-pulse">
                              <div className="mt-0.5 h-10 w-10 shrink-0 rounded-lg bg-muted" />
                              <div className="flex-1 space-y-2">
                                <div className="h-3 w-3/4 rounded bg-muted" />
                                <div className="h-2 w-1/2 rounded bg-muted" />
                                <div className="h-4 w-16 rounded-full bg-muted" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : qs.externalFilteredApps.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Nenhum resultado externo para esta busca.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2.5">
                          {qs.externalFilteredApps.map((app) => (
                            <AppCard
                              key={app.id}
                              app={app}
                              selected={qs.selectedIds.has(app.id)}
                              available={qs.isAppAvailable(app)}
                              packageName={qs.getAppPackage(app)}
                              onToggle={qs.toggleApp}
                            />
                          ))}
                        </div>
                      )}
                    </section>}
                  </div>
                )}
              </main>

              {/* Script Panel — sidebar right */}
              <aside className="hidden lg:flex w-80 xl:w-96 border-l border-border/60 bg-gray-950 flex-col overflow-auto scrollbar-thin">
                {/* Panel header */}
                <div className="px-5 pt-5 pb-4 border-b border-gray-800">
                  <h2 className="text-xs uppercase tracking-widest font-semibold text-gray-500">Painel do Script</h2>
                </div>
                <div className="flex-1 p-5">
                  <ScriptPreview
                    script={qs.script}
                    scriptBat={qs.scriptBat}
                    scriptPs1={qs.scriptPs1}
                    scriptSh={qs.scriptSh}
                    scriptNix={qs.scriptNix}
                    packageManager={qs.packageManager}
                    count={qs.selectedApps.length}
                    onAfterAction={showSupportCTA}
                  />
                </div>
              </aside>
            </>
          ) : tab === "upgrade" ? (
            <main className="flex-1 overflow-auto p-5 lg:p-6 max-w-2xl">
              <UpgradeTab
                platform={qs.platform}
                linuxDistro={qs.linuxDistro}
                onPlatformChange={qs.setPlatform}
                onLinuxDistroChange={qs.setLinuxDistro}
              />
            </main>
          ) : (
            <OsCatalogTab />
          )}
        </div>

        {/* Mobile script panel */}
        {tab === "install" && qs.selectedApps.length > 0 && (
          <div className="lg:hidden border-t border-border/60 bg-gray-950 p-4">
            <ScriptPreview
              script={qs.script}
              scriptBat={qs.scriptBat}
              scriptPs1={qs.scriptPs1}
              scriptSh={qs.scriptSh}
              scriptNix={qs.scriptNix}
              packageManager={qs.packageManager}
              count={qs.selectedApps.length}
              onAfterAction={showSupportCTA}
            />
          </div>
        )}
      </div>
      </div>

      <Footer />

      {/* Sticky selection bar */}
      {tab === "install" && qs.selectedApps.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:left-[calc(50%+8rem)] lg:-translate-x-1/2">
          <div className="flex items-center gap-3 bg-white border border-border shadow-2xl shadow-black/15 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-[11px] text-white font-bold">{qs.selectedApps.length}</span>
              </div>
              <span>
                {qs.selectedApps.length} {qs.selectedApps.length === 1 ? "app selecionado" : "apps selecionados"}
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <button
              onClick={handleShare}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                shareCopied
                  ? "bg-green-500 text-white shadow-sm shadow-green-200"
                  : "bg-muted text-muted-foreground hover:bg-blue-50 hover:text-blue-600 border border-border"
              }`}
              title="Copiar link de compartilhamento"
            >
              {shareCopied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              <span className="hidden sm:inline">{shareCopied ? "Link copiado!" : "Compartilhar"}</span>
            </button>
            <button
              onClick={handleBarCopy}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                barCopied
                  ? "bg-green-500 text-white shadow-sm shadow-green-200"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200"
              }`}
            >
              {barCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {barCopied ? "Copiado!" : "Copiar Script"}
            </button>
          </div>
        </div>
      )}

      <SupportButton />
    </div>
  );
}

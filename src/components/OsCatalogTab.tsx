import { useState, useMemo } from "react";
import {
  Search,
  ExternalLink,
  Monitor,
  Apple,
  Terminal,
  Cpu,
  Shield,
  Star,
  Clock,
  Tag,
  Wrench,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  osCatalog,
  osCategoryLabels,
  type OsCategory,
  type OsRelease,
} from "@/data/os-catalog";

const categoryIcons: Record<OsCategory, React.ReactNode> = {
  windows: <Monitor className="h-4 w-4" />,
  macos: <Apple className="h-4 w-4" />,
  linux: <Terminal className="h-4 w-4" />,
  embedded: <Cpu className="h-4 w-4" />,
};

const categoryColors: Record<OsCategory, { bg: string; text: string; border: string; badge: string }> = {
  windows: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
  },
  macos: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
    badge: "bg-gray-100 text-gray-700",
  },
  linux: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700",
  },
  embedded: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700",
  },
};

const allCategories: (OsCategory | "all")[] = ["all", "windows", "macos", "linux", "embedded"];

function OsCard({ os }: { os: OsRelease }) {
  const colors = categoryColors[os.category];
  return (
    <div
      className={`rounded-xl border ${colors.border} bg-white flex flex-col gap-3 p-4 shadow-sm hover:shadow-md transition-shadow`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`h-9 w-9 shrink-0 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center`}
          >
            {os.isTool ? (
              <Wrench className="h-4 w-4" />
            ) : (
              categoryIcons[os.category]
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground leading-tight truncate">
              {os.name}
            </p>
            <p className={`text-xs font-medium ${colors.text} mt-0.5`}>
              Versão {os.version}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          {os.isLatest && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
              <Star className="h-2.5 w-2.5" />
              Atual
            </span>
          )}
          {os.isLts && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">
              <Shield className="h-2.5 w-2.5" />
              LTS
            </span>
          )}
          {os.isTool && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
              <Wrench className="h-2.5 w-2.5" />
              Ferramenta
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed flex-1">
        {os.description}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {os.releaseDate && (
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {new Date(os.releaseDate).toLocaleDateString("pt-BR", {
              month: "short",
              year: "numeric",
            })}
          </span>
        )}
        {os.architecture.length > 0 && (
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <Tag className="h-3 w-3" />
            {os.architecture.join(", ")}
          </span>
        )}
      </div>

      {/* Tags */}
      {os.tags && os.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {os.tags.map((tag) => (
            <span
              key={tag}
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${colors.badge}`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-border/40">
        <a
          href={os.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${colors.bg} ${colors.text} hover:opacity-80 border ${colors.border}`}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {os.isTool ? "Baixar ferramenta" : "Download oficial"}
        </a>
        {os.releaseNotesUrl && (
          <a
            href={os.releaseNotesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-border/50 transition-colors"
            title="Notas de versão"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Notas
          </a>
        )}
      </div>
    </div>
  );
}

export function OsCatalogTab() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<OsCategory | "all">("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return osCatalog.filter((os) => {
      const matchesCategory =
        activeCategory === "all" || os.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        os.name.toLowerCase().includes(q) ||
        os.description.toLowerCase().includes(q) ||
        os.version.toLowerCase().includes(q) ||
        (os.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [search, activeCategory]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: osCatalog.length };
    for (const os of osCatalog) {
      c[os.category] = (c[os.category] || 0) + 1;
    }
    return c;
  }, []);

  return (
    <div className="flex-1 overflow-auto p-5 lg:p-6 bg-background">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-1">
          <Monitor className="h-5 w-5 text-blue-500" />
          Catálogo de Sistemas Operacionais
        </h2>
        <p className="text-sm text-muted-foreground">
          Downloads oficiais de sistemas operacionais e ferramentas relacionadas.
          Apenas links oficiais — sem mirrors, torrents ou fontes não verificadas.
        </p>

        {/* Security notice */}
        <div className="mt-3 inline-flex items-start gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <Shield className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>
            Todos os links redirecionam para os sites oficiais dos fabricantes. Nunca
            compartilhamos mirrors, torrents ou uploads próprios.
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar sistema operacional..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-9 text-sm bg-muted/40 border-border/60 focus:bg-white transition-colors"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1 rounded-xl bg-muted/50 border border-border/60 p-1 flex-wrap">
          {allCategories.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant="ghost"
              onClick={() => setActiveCategory(cat)}
              className={`h-7 px-2.5 text-xs font-semibold gap-1.5 rounded-lg transition-all ${
                activeCategory === cat
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat !== "all" && categoryIcons[cat as OsCategory]}
              <span>
                {cat === "all" ? "Todos" : osCategoryLabels[cat as OsCategory]}
              </span>
              <span className="text-[10px] bg-muted/80 px-1 rounded">
                {counts[cat] ?? 0}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4 border border-border/50">
            <Search className="h-7 w-7 text-muted-foreground/40" />
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Nenhum sistema encontrado
          </p>
          <p className="text-xs text-muted-foreground/60">
            Tente outro termo de busca ou categoria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
          {filtered.map((os) => (
            <OsCard key={os.id} os={os} />
          ))}
        </div>
      )}
    </div>
  );
}

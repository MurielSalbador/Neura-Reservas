"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Star, MapPin, SlidersHorizontal, X, Loader2, ChevronDown, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const categories = [
  { name: "Canchas", slug: "canchas", emoji: "⚽" },
  { name: "Salones", slug: "salones", emoji: "🎉" },
  { name: "Peluquerías", slug: "peluquerias", emoji: "✂️" },
  { name: "Estética", slug: "estetica", emoji: "💆" },
  { name: "Gimnasios", slug: "gimnasios", emoji: "🏋️" },
  { name: "Estudios", slug: "estudios", emoji: "📸" },
  { name: "Restaurantes", slug: "restaurantes", emoji: "🍽️" },
  { name: "Consultorios", slug: "consultorios", emoji: "🏥" },
];

type Business = {
  id: string;
  slug: string;
  name: string;
  coverUrl: string | null;
  city: string | null;
  rating: number;
  reviewCount: number;
  minPrice: number | null;
  tag: string | null;
  isFeatured: boolean;
  category: { name: string; slug: string };
};

function ExplorarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCat = searchParams.get("cat") ?? "";
  const [activeCats, setActiveCats] = useState<string[]>(initialCat ? [initialCat] : []);
  const [catDropOpen, setCatDropOpen] = useState(false);
  const catDropRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    const res = await fetch(`/api/businesses?${params}`);
    const data = await res.json();
    setBusinesses(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [query]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (catDropRef.current && !catDropRef.current.contains(e.target as Node)) {
        setCatDropOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggleCat(slug: string) {
    setActiveCats((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
    router.replace("/explorar", { scroll: false });
  }

  function clearCats() {
    setActiveCats([]);
    router.replace("/explorar", { scroll: false });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchBusinesses();
  }

  const sorted = [...businesses]
    .filter((b) => activeCats.length === 0 || activeCats.includes(b.category.slug))
    .sort((a, b) => sortBy === "rating" ? b.rating - a.rating : b.reviewCount - a.reviewCount);

  const catLabel = activeCats.length === 0
    ? "Categoría"
    : activeCats.length === 1
    ? (categories.find((c) => c.slug === activeCats[0])?.name ?? "Categoría")
    : `${activeCats.length} categorías`;

  return (
    <div className="px-6 py-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">Explorar negocios</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {loading ? "Cargando..." : `${sorted.length} resultado${sorted.length !== 1 ? "s" : ""}${activeCats.length > 0 ? ` en ${catLabel}` : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar negocio..."
              className="w-full h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] pl-9 pr-8 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-400/50 transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>

          {/* Category dropdown */}
          <div className="relative" ref={catDropRef}>
            <button
              onClick={() => setCatDropOpen((o) => !o)}
              className={`flex items-center gap-2 h-10 rounded-xl border px-3 text-sm transition-all whitespace-nowrap ${
                activeCats.length > 0
                  ? "bg-brand-500/20 border-brand-500/30 text-brand-300"
                  : "bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-white"
              }`}
            >
              {catLabel}
              {activeCats.length > 0 && (
                <span
                  onClick={(e) => { e.stopPropagation(); clearCats(); }}
                  className="ml-1 text-brand-300 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </span>
              )}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${catDropOpen ? "rotate-180" : ""}`} />
            </button>
            {catDropOpen && (
              <div className="absolute right-0 top-12 z-30 w-52 rounded-2xl border border-white/[0.1] bg-[#0c1230] shadow-2xl py-2">
                {categories.map((cat) => {
                  const active = activeCats.includes(cat.slug);
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => toggleCat(cat.slug)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/[0.05] transition-colors"
                    >
                      <span className="text-base leading-none">{cat.emoji}</span>
                      <span className={`flex-1 text-left ${active ? "text-white font-medium" : "text-slate-400"}`}>
                        {cat.name}
                      </span>
                      {active && <Check className="h-3.5 w-3.5 text-brand-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 h-10 rounded-xl border px-3 text-sm transition-all ${showFilters ? "bg-brand-500/20 border-brand-500/30 text-brand-300" : "bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-white"}`}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Sort filters */}
      {showFilters && (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 flex items-center gap-4">
          <div>
            <p className="text-xs text-slate-500 mb-1.5">Ordenar por</p>
            <div className="flex gap-2">
              {[{ value: "rating", label: "Mejor puntuación" }, { value: "reviews", label: "Más reseñas" }].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sortBy === opt.value ? "bg-brand-500 text-white" : "bg-white/[0.06] text-slate-400 hover:text-white"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-brand-400 animate-spin" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg font-semibold text-white">Sin resultados</p>
          <p className="text-sm text-slate-500 mt-1">Probá con otra categoría o término de búsqueda</p>
          <button
            onClick={() => { clearCats(); setQuery(""); }}
            className="mt-4 text-sm text-brand-300 hover:text-brand-200 transition-colors"
          >
            Ver todos los negocios
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {sorted.map((biz) => (
            <Link
              key={biz.slug}
              href={`/negocio/${biz.slug}`}
              className="group rounded-2xl border border-white/[0.08] bg-[#0a0f25] overflow-hidden hover:border-white/20 hover:-translate-y-1 transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500 bg-brand-900"
                  style={biz.coverUrl ? { backgroundImage: `url(${biz.coverUrl})` } : {}}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                {biz.tag && (
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${biz.tag === "Popular" ? "bg-teal-500/90 text-white" : "bg-brand-500/90 text-white"}`}>
                      {biz.tag}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white text-sm leading-snug truncate">{biz.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{biz.category.name}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-medium text-white">{biz.rating.toFixed(1)}</span>
                  </div>
                </div>
                {biz.city && (
                  <div className="flex items-center gap-1 mt-2">
                    <MapPin className="h-3 w-3 text-slate-600" />
                    <p className="text-[11px] text-slate-500">{biz.city}</p>
                  </div>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
                  <span className="text-xs font-semibold text-brand-300">
                    {biz.minPrice && biz.minPrice > 0 ? `Desde ${formatCurrency(biz.minPrice)}` : "Reserva sin cargo"}
                  </span>
                  <span className="text-[10px] text-slate-600">({biz.reviewCount} reseñas)</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExplorarPage() {
  return (
    <Suspense fallback={<div className="px-6 py-6 text-slate-500 text-sm">Cargando...</div>}>
      <ExplorarContent />
    </Suspense>
  );
}

"use client";

import Link from "next/link";
import {
  ArrowRight,
  Search,
  Star,
  MapPin,
  CalendarDays,
  Smile,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const categories = [
  { name: "Canchas", slug: "canchas", emoji: "⚽", count: 32, color: "from-green-500/20 to-green-600/5", border: "border-green-500/20", iconBg: "bg-green-500/20 text-green-400" },
  { name: "Salones", slug: "salones", emoji: "🎉", count: 18, color: "from-purple-500/20 to-purple-600/5", border: "border-purple-500/20", iconBg: "bg-purple-500/20 text-purple-400" },
  { name: "Peluquerías", slug: "peluquerias", emoji: "✂️", count: 45, color: "from-orange-500/20 to-orange-600/5", border: "border-orange-500/20", iconBg: "bg-orange-500/20 text-orange-400" },
  { name: "Estética", slug: "estetica", emoji: "💆", count: 28, color: "from-pink-500/20 to-pink-600/5", border: "border-pink-500/20", iconBg: "bg-pink-500/20 text-pink-400" },
  { name: "Gimnasios", slug: "gimnasios", emoji: "🏋️", count: 22, color: "from-blue-500/20 to-blue-600/5", border: "border-blue-500/20", iconBg: "bg-blue-500/20 text-blue-400" },
  { name: "Estudios", slug: "estudios", emoji: "📸", count: 15, color: "from-yellow-500/20 to-yellow-600/5", border: "border-yellow-500/20", iconBg: "bg-yellow-500/20 text-yellow-400" },
  { name: "Restaurantes", slug: "restaurantes", emoji: "🍽️", count: 36, color: "from-red-500/20 to-red-600/5", border: "border-red-500/20", iconBg: "bg-red-500/20 text-red-400" },
  { name: "Consultorios", slug: "consultorios", emoji: "🏥", count: 17, color: "from-cyan-500/20 to-cyan-600/5", border: "border-cyan-500/20", iconBg: "bg-cyan-500/20 text-cyan-400" },
  { name: "Más", slug: "", emoji: "···", count: null, color: "from-slate-500/20 to-slate-600/5", border: "border-slate-500/20", iconBg: "bg-slate-500/20 text-slate-400" },
];

const featured = [
  {
    slug: "complejo-la-superiora",
    name: "Complejo La Superiora",
    category: "Canchas de Fútbol",
    city: "Rosario, Santa Fe",
    rating: 4.8,
    reviews: 124,
    price: "$12.000 / hs",
    tag: "Popular",
    tagColor: "bg-teal-500/90 text-white",
    cover: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80",
  },
  {
    slug: "salon-imperial",
    name: "Salón Imperial",
    category: "Salones de Eventos",
    city: "Funes, Santa Fe",
    rating: 4.9,
    reviews: 89,
    price: "Desde $150.000",
    tag: "Nuevo",
    tagColor: "bg-brand-500/90 text-white",
    cover: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80",
  },
  {
    slug: "studio-hair",
    name: "Studio Hair",
    category: "Peluquería",
    city: "Rosario, Santa Fe",
    rating: 4.7,
    reviews: 203,
    price: "Desde $8.000",
    tag: "Popular",
    tagColor: "bg-teal-500/90 text-white",
    cover: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80",
  },
  {
    slug: "bella-estetica",
    name: "Bella Estética",
    category: "Centro de Estética",
    city: "Rosario, Santa Fe",
    rating: 4.6,
    reviews: 156,
    price: "Desde $6.000",
    tag: "Nuevo",
    tagColor: "bg-brand-500/90 text-white",
    cover: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Elegí",
    desc: "Buscá el servicio que necesitás",
    icon: Search,
    color: "bg-brand-500/20 text-brand-300",
  },
  {
    step: "2",
    title: "Reservá",
    desc: "Seleccioná fecha y hora en segundos",
    icon: CalendarDays,
    color: "bg-purple-500/20 text-purple-300",
  },
  {
    step: "3",
    title: "Disfrutá",
    desc: "Recibí confirmación y listo",
    icon: Smile,
    color: "bg-green-500/20 text-green-300",
  },
];

const stats = [
  { label: "Negocios activos", value: "250+" },
  { label: "Reservas realizadas", value: "12.000+" },
  { label: "Ciudades", value: "15" },
];

export default function HomePage() {
  return (
    <div className="px-6 py-6 space-y-8 max-w-5xl mx-auto">
      {/* Hero */}
      <div className="relative rounded-[28px] overflow-hidden border border-white/[0.08] bg-gradient-to-br from-[#0d1535] to-[#080c24]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(79,70,229,0.25),_transparent_60%)]" />
        <div className="relative flex flex-col lg:flex-row gap-8 p-8">
          {/* Text */}
          <div className="flex-1 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/15 border border-brand-500/20 px-3 py-1.5">
              <Star className="h-3 w-3 text-brand-300 fill-brand-300" />
              <span className="text-xs text-brand-200 font-medium">La plataforma #1 de reservas</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white leading-tight">
                Reservá lo que quieras,{" "}
                <span className="text-brand-300">cuando quieras</span>
              </h1>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-md">
                Encontrá y reservá los mejores servicios en tu ciudad de forma rápida y segura.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/mis-reservas"
                className="flex items-center gap-2 h-11 rounded-xl bg-brand-500 hover:bg-brand-400 px-6 text-sm font-semibold text-white transition-colors"
              >
                <CalendarDays className="h-4 w-4" />
                Mis Reservas
              </Link>
              <Link
                href="/explorar"
                className="flex items-center gap-2 h-11 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.1] px-6 text-sm font-semibold text-white transition-colors"
              >
                <Search className="h-4 w-4" />
                Explorar servicios
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div className="lg:w-64 xl:w-80 flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-[260px]">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/30 to-purple-600/20 rounded-3xl blur-3xl" />
              <div className="relative h-full bg-gradient-to-br from-[#1a2250] to-[#0d1535] rounded-3xl border border-white/10 overflow-hidden p-5 flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-brand-500/30 flex items-center justify-center">
                    <CalendarDays className="h-4 w-4 text-brand-300" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Reserva confirmada</p>
                    <p className="text-sm font-semibold text-white">Cancha 1 · 20:00 hs</p>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
                    <p key={d} className="text-center text-[9px] text-slate-600 font-medium">{d}</p>
                  ))}
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                    <div
                      key={d}
                      className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-medium transition-all ${
                        d === 15
                          ? "bg-brand-500 text-white"
                          : d === 18 || d === 22 || d === 25
                          ? "bg-brand-500/20 text-brand-300"
                          : "text-slate-600 hover:bg-white/5"
                      }`}
                    >
                      {d}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {["#5b77e4", "#a855f7", "#22c55e"].map((c, i) => (
                      <div key={i} className="h-7 w-7 rounded-full border-2 border-[#0d1535]" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">3 turnos hoy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white">Explorá por categoría</h2>
            <p className="text-sm text-slate-500 mt-0.5">Encontrá el tipo de negocio que buscás</p>
          </div>
          <Link
            href="/explorar"
            className="flex items-center gap-1.5 text-sm text-brand-300 hover:text-brand-200 transition-colors"
          >
            Ver todas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex gap-3 w-max animate-marquee hover:[animation-play-state:paused]">
            {[...categories, ...categories].map((cat, i) => (
              <Link
                key={i}
                href={cat.slug ? `/explorar?cat=${cat.slug}` : "/explorar"}
                className={`group flex-shrink-0 flex flex-col items-center gap-2 rounded-2xl border ${cat.border} bg-gradient-to-b ${cat.color} p-3 w-24 hover:scale-105 transition-all`}
              >
                <div className={`h-10 w-10 rounded-xl ${cat.iconBg} flex items-center justify-center text-xl`}>
                  {cat.emoji}
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-white leading-snug">{cat.name}</p>
                  {cat.count !== null && (
                    <p className="text-[9px] text-slate-500 mt-0.5">{cat.count} negocios</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured businesses */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white">Negocios destacados</h2>
            <p className="text-sm text-slate-500 mt-0.5">Los mejores lugares para reservar</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/explorar" className="text-sm text-brand-300 hover:text-brand-200 transition-colors mr-2">
              Ver todos
            </Link>
            <button className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {featured.map((biz) => (
            <Link
              key={biz.slug}
              href={`/negocio/${biz.slug}`}
              className="group rounded-2xl border border-white/[0.08] bg-[#0a0f25] overflow-hidden hover:border-white/20 hover:-translate-y-1 transition-all"
            >
              <div className="relative h-44 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url(${biz.cover})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${biz.tagColor}`}>
                    {biz.tag}
                  </span>
                </div>
              </div>
              <div className="p-3.5">
                <h3 className="font-semibold text-white text-sm leading-snug">{biz.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{biz.category}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <MapPin className="h-3 w-3 text-slate-600" />
                  <p className="text-[11px] text-slate-500">{biz.city}</p>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-medium text-white">{biz.rating}</span>
                    <span className="text-[10px] text-slate-600">({biz.reviews})</span>
                  </div>
                  <span className="text-xs font-semibold text-brand-300">{biz.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="rounded-[24px] border border-white/[0.06] bg-[#080c20] p-6">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-white">Así de fácil funciona</h2>
          <p className="text-sm text-slate-500 mt-1">En 3 pasos tenés tu reserva lista</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
          <div className="hidden sm:block absolute top-8 left-[calc(16.66%+16px)] right-[calc(16.66%+16px)] h-px bg-gradient-to-r from-brand-500/30 via-purple-500/30 to-green-500/30" />
          {howItWorks.map((step) => (
            <div key={step.step} className="relative flex flex-col items-center text-center gap-3 p-4 rounded-2xl bg-white/[0.02]">
              <div className={`h-14 w-14 rounded-2xl ${step.color} flex items-center justify-center`}>
                <step.icon className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">{step.step}.</span>
                <p className="text-base font-bold text-white">{step.title}</p>
                <p className="text-xs text-slate-500 mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

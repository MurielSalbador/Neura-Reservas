"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, MapPin, Phone, ChevronLeft, Share2, CalendarDays, Users, Check, Loader2 } from "lucide-react";
import BookingPanel from "@/components/booking/BookingPanel";

type Resource = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  duration: number | null;
  capacity: number | null;
};

type Business = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  coverUrl: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  phone: string | null;
  rating: number;
  reviewCount: number;
  tag: string | null;
  bookingMode: string;
  resources: Resource[];
  category: { name: string; slug: string };
};

const features = [
  "Estacionamiento gratuito",
  "WiFi disponible",
  "Reserva online",
  "Atención personalizada",
  "Instalaciones modernas",
  "Fácil acceso",
];

function handleShare(name: string) {
  if (navigator.share) {
    navigator.share({ title: name, url: window.location.href });
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert("¡Enlace copiado al portapapeles!");
  }
}

export default function NegocioPage({ params }: { params: { slug: string } }) {
  const [biz, setBiz] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/businesses?slug=${params.slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data) { setNotFound(true); }
        else { setBiz(data); }
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 text-brand-400 animate-spin" />
      </div>
    );
  }

  if (notFound || !biz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <p className="text-4xl mb-4">🏢</p>
        <h1 className="text-xl font-bold text-white">Negocio no encontrado</h1>
        <p className="text-sm text-slate-500 mt-2">Este negocio no existe o fue removido.</p>
        <Link href="/explorar" className="mt-4 text-sm text-brand-300 hover:text-brand-200 transition-colors">
          ← Volver a explorar
        </Link>
      </div>
    );
  }

  const panelBiz = {
    id: biz.id,
    name: biz.name,
    bookingMode: biz.bookingMode,
    resources: biz.resources.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description ?? "",
      price: r.price ?? 0,
      duration: r.duration,
      capacity: r.capacity,
    })),
  };

  return (
    <div className="pb-10">
      {/* Cover */}
      <div className="relative h-64 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-brand-900"
          style={biz.coverUrl ? { backgroundImage: `url(${biz.coverUrl})` } : {}}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-black/30 to-transparent" />
        <div className="absolute top-4 left-6 right-6 flex items-center justify-between">
          <Link
            href="/explorar"
            className="flex items-center gap-1.5 rounded-xl bg-black/40 backdrop-blur-sm border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-black/60 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver
          </Link>
          <button
            onClick={() => handleShare(biz.name)}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/40 backdrop-blur-sm border border-white/20 text-white hover:bg-black/60 transition-colors"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
        {biz.tag && (
          <div className="absolute bottom-4 left-6">
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${biz.tag === "Popular" ? "bg-teal-500/90" : "bg-brand-500/90"} text-white backdrop-blur-sm`}>
              {biz.tag}
            </span>
          </div>
        )}
      </div>

      <div className="px-6 -mt-2">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Info */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Header */}
            <div>
              <p className="text-sm text-brand-300 font-medium">{biz.category.name}</p>
              <h1 className="text-2xl font-bold text-white mt-1">{biz.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold text-white">{biz.rating.toFixed(1)}</span>
                  <span className="text-sm text-slate-500">({biz.reviewCount} reseñas)</span>
                </div>
                {(biz.address || biz.city) && (
                  <div className="flex items-center gap-1.5 text-sm text-slate-400">
                    <MapPin className="h-4 w-4 text-slate-600" />
                    {[biz.address, biz.city, biz.province].filter(Boolean).join(", ")}
                  </div>
                )}
                {biz.phone && (
                  <a href={`tel:${biz.phone}`} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
                    <Phone className="h-4 w-4 text-slate-600" />
                    {biz.phone}
                  </a>
                )}
              </div>
            </div>

            {/* Description */}
            {biz.description && (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <h2 className="text-sm font-semibold text-white mb-2">Sobre el negocio</h2>
                <p className="text-sm text-slate-400 leading-relaxed">{biz.description}</p>
              </div>
            )}

            {/* Features */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h2 className="text-sm font-semibold text-white mb-3">Servicios e instalaciones</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-400">
                    <Check className="h-4 w-4 text-brand-400 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <h2 className="text-sm font-semibold text-white mb-3">
                {biz.bookingMode === "appointment" ? "Profesionales / Servicios" : "Disponibilidad"}
              </h2>
              <div className="space-y-2">
                {biz.resources.map((res) => (
                  <div
                    key={res.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 hover:border-brand-500/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
                        {biz.bookingMode === "appointment" ? (
                          <Users className="h-5 w-5" />
                        ) : (
                          <CalendarDays className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{res.name}</p>
                        {res.description && (
                          <p className="text-xs text-slate-500 mt-0.5">{res.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {res.price !== null && res.price > 0 ? (
                        <p className="text-sm font-bold text-brand-300">
                          ${res.price.toLocaleString("es-AR")}
                          {biz.bookingMode === "hourly" ? " / hs" : ""}
                        </p>
                      ) : (
                        <p className="text-sm text-slate-500">Sin cargo</p>
                      )}
                      {res.duration && (
                        <p className="text-[11px] text-slate-600">{res.duration} min</p>
                      )}
                      {res.capacity && (
                        <p className="text-[11px] text-slate-600">Hasta {res.capacity} pers.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Booking panel */}
          <div className="lg:w-80 xl:w-96 flex-shrink-0">
            {panelBiz.resources.length > 0 ? (
              <BookingPanel biz={panelBiz} />
            ) : (
              <div className="sticky top-20 rounded-2xl border border-white/[0.08] bg-[#0a0f25] p-6 text-center text-slate-500 text-sm">
                Sin recursos disponibles
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

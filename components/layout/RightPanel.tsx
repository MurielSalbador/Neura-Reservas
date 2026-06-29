import Link from "next/link";
import { Crown, CalendarDays, ChevronRight, MessageCircle, Smartphone } from "lucide-react";
import { STATUS_COLORS, STATUS_LABELS, formatDateShort, formatTime } from "@/lib/utils";

const upcomingBookings = [
  {
    id: "1",
    businessName: "Complejo La Superiora",
    resourceName: "Cancha 1",
    date: new Date(Date.now() + 2 * 86400000),
    time: "20:00 hs",
    status: "confirmed",
    cover: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=200&q=70",
  },
  {
    id: "2",
    businessName: "Studio Hair",
    resourceName: "Corte de pelo",
    date: new Date(Date.now() + 4 * 86400000),
    time: "11:00 hs",
    status: "pending",
    cover: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=200&q=70",
  },
  {
    id: "3",
    businessName: "Salón Imperial",
    resourceName: "Evento privado",
    date: new Date(Date.now() + 7 * 86400000),
    time: "19:00 hs",
    status: "confirmed",
    cover: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200&q=70",
  },
];

export default function RightPanel() {
  return (
    <aside className="fixed right-0 top-0 h-screen w-[300px] flex flex-col border-l border-white/[0.06] bg-[#060918] overflow-y-auto z-30 pt-16">
      <div className="flex flex-col gap-4 p-4">
        {/* Plan card */}
        <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20">
              <Crown className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-brand-200 leading-none">Tu plan actual</p>
              <p className="text-sm font-bold text-white leading-tight">Profesional</p>
            </div>
          </div>
          <button className="w-full rounded-xl bg-white/20 hover:bg-white/30 py-2 text-xs font-semibold text-white transition-colors">
            Ver beneficios
          </button>
        </div>

        {/* Upcoming bookings */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Próximas reservas
            </p>
          </div>
          <div className="space-y-2">
            {upcomingBookings.map((b) => (
              <div
                key={b.id}
                className="flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                <div
                  className="h-12 w-12 rounded-xl flex-shrink-0 bg-brand-800 bg-cover bg-center"
                  style={{ backgroundImage: `url(${b.cover})` }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate leading-snug">{b.businessName}</p>
                  <p className="text-xs text-slate-500 truncate">{b.resourceName}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-slate-500">
                      {formatDateShort(b.date)} · {b.time}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[b.status]}`}>
                      {STATUS_LABELS[b.status]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/mis-reservas"
            className="mt-3 flex items-center justify-center gap-1 w-full rounded-xl border border-white/[0.08] py-2.5 text-xs font-medium text-slate-400 hover:text-white hover:border-white/20 transition-all"
          >
            Ver todas mis reservas
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* App CTA */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="h-4 w-4 text-brand-300" />
            <p className="text-sm font-semibold text-white">Reservá desde la app</p>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Descargá la app de TuReserva y llevá tus reservas a todos lados.
          </p>
          <div className="flex gap-2">
            <button className="flex-1 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] py-2 text-[10px] font-medium text-slate-300 transition-colors">
              App Store
            </button>
            <button className="flex-1 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] py-2 text-[10px] font-medium text-slate-300 transition-colors">
              Google Play
            </button>
          </div>
        </div>

        {/* Help */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-sm font-semibold text-white mb-1">¿Necesitás ayuda?</p>
          <p className="text-xs text-slate-500 mb-3">Nuestro equipo está para ayudarte</p>
          <button className="flex items-center justify-center gap-2 w-full rounded-xl bg-brand-500/20 hover:bg-brand-500/30 border border-brand-500/20 py-2.5 text-xs font-semibold text-brand-300 transition-colors">
            <MessageCircle className="h-3.5 w-3.5" />
            Chatear ahora
          </button>
        </div>
      </div>
    </aside>
  );
}

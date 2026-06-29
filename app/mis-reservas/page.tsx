"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Clock, Search, Loader2 } from "lucide-react";
import { STATUS_COLORS, STATUS_LABELS, formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { useAuth } from "@/app/context/AuthContext";

type Booking = {
  id: string;
  status: string;
  date: string;
  startTime: string | null;
  mode: string;
  totalAmount: number;
  depositAmount: number;
  customerName: string;
  business: { id: string; name: string; slug: string; coverUrl: string | null; city: string | null };
  resource: { id: string; name: string };
};

const tabs = [
  { key: "all", label: "Todas" },
  { key: "upcoming", label: "Próximas" },
  { key: "completed", label: "Finalizadas" },
  { key: "cancelled", label: "Canceladas" },
];

export default function MisReservasPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`/api/bookings?userId=${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  async function handleCancel(id: string) {
    if (!confirm("¿Cancelar esta reserva?")) return;
    setCancelling(id);
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    if (res.ok) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
      );
    }
    setCancelling(null);
  }

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 text-brand-400 animate-spin" />
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  const filtered = bookings
    .filter((b) => {
      const dateStr = b.date.split("T")[0];
      if (activeTab === "upcoming") return ["pending", "confirmed", "deposited"].includes(b.status) && dateStr >= today;
      if (activeTab === "completed") return b.status === "completed";
      if (activeTab === "cancelled") return b.status === "cancelled";
      return true;
    })
    .filter((b) =>
      !query ||
      b.business.name.toLowerCase().includes(query.toLowerCase()) ||
      b.resource.name.toLowerCase().includes(query.toLowerCase())
    );

  const upcoming = bookings.filter((b) => {
    const dateStr = b.date.split("T")[0];
    return ["pending", "confirmed"].includes(b.status) && dateStr >= today;
  }).length;

  return (
    <div className="px-6 py-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Mis Reservas</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {loading ? "Cargando..." : `${upcoming} próxima${upcoming !== 1 ? "s" : ""} · ${bookings.length} en total`}
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar reserva..."
          className="w-full h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-400/50 transition-all"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/[0.06]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 px-1 text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === tab.key
                ? "border-brand-400 text-white"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab.label}
            {tab.key === "upcoming" && upcoming > 0 && (
              <span className="ml-1.5 rounded-full bg-brand-500/30 text-brand-300 text-[10px] px-1.5 py-0.5">
                {upcoming}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-brand-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CalendarDays className="h-12 w-12 text-slate-700 mb-4" />
          <p className="text-lg font-semibold text-white">Sin reservas</p>
          <p className="text-sm text-slate-500 mt-1">
            {activeTab === "all" ? "Todavía no hiciste ninguna reserva" : "No hay reservas en esta categoría"}
          </p>
          <Link href="/explorar" className="mt-4 text-sm text-brand-300 hover:text-brand-200 transition-colors">
            Explorar negocios →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => {
            const dateStr = b.date.split("T")[0];
            const isPast = dateStr < today;
            const pending = b.totalAmount - b.depositAmount;
            return (
              <div
                key={b.id}
                className="group rounded-2xl border border-white/[0.08] bg-[#0a0f25] overflow-hidden hover:border-white/20 transition-all"
              >
                <div className="flex gap-4 p-4">
                  {/* Cover */}
                  <div
                    className="h-20 w-24 flex-shrink-0 rounded-xl bg-cover bg-center bg-brand-800"
                    style={b.business.coverUrl ? { backgroundImage: `url(${b.business.coverUrl})` } : {}}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{b.business.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{b.resource.name}</p>
                      </div>
                      <span className={`flex-shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[b.status] ?? "bg-slate-500/15 text-slate-300"}`}>
                        {STATUS_LABELS[b.status] ?? b.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-2.5">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(b.date)}
                      </div>
                      {b.startTime && (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="h-3.5 w-3.5" />
                          {formatTime(b.startTime)} hs
                        </div>
                      )}
                      {b.business.city && (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin className="h-3.5 w-3.5" />
                          {b.business.city}
                        </div>
                      )}
                    </div>

                    {/* Payment & actions */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-slate-500">
                          Total: <span className="text-white font-medium">{formatCurrency(b.totalAmount)}</span>
                        </span>
                        {b.depositAmount > 0 && (
                          <span className="text-slate-500">
                            Seña: <span className="text-green-400 font-medium">{formatCurrency(b.depositAmount)}</span>
                          </span>
                        )}
                        {pending > 0 && b.status !== "cancelled" && (
                          <span className="text-slate-500">
                            Saldo: <span className="text-yellow-400 font-medium">{formatCurrency(pending)}</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!isPast && !["cancelled", "completed"].includes(b.status) && (
                          <button
                            onClick={() => handleCancel(b.id)}
                            disabled={cancelling === b.id}
                            className="text-xs text-red-400/70 hover:text-red-400 disabled:opacity-50 transition-colors"
                          >
                            {cancelling === b.id ? "Cancelando..." : "Cancelar"}
                          </button>
                        )}
                        <Link
                          href={`/negocio/${b.business.slug}`}
                          className="text-xs text-brand-300 hover:text-brand-200 transition-colors"
                        >
                          Ver negocio →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

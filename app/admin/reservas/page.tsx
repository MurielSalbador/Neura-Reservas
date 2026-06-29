"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search, X, Check, CheckCheck, CalendarDays, TrendingUp, Clock, Users,
  Pencil, Trash2, RefreshCw, Loader2, AlertCircle, Save,
} from "lucide-react";
import { formatCurrency, formatTime, STATUS_COLORS, STATUS_LABELS } from "@/lib/utils";
import { useAuth } from "@/app/context/AuthContext";

type Booking = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  notes: string | null;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  depositAmount: number;
  paidAmount: number;
  date: string;
  endDate: string | null;
  startTime: string | null;
  endTime: string | null;
  mode: string;
  business: {
    id: string;
    name: string;
    coverUrl: string | null;
    city: string | null;
    category: { name: string } | null;
  };
  resource: { id: string; name: string; type: string | null };
};

const STATUS_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "pending", label: "Pendiente" },
  { value: "confirmed", label: "Confirmada" },
  { value: "completed", label: "Finalizada" },
  { value: "cancelled", label: "Cancelada" },
];

const STATUS_EDIT_OPTIONS = [
  { value: "pending", label: "Pendiente" },
  { value: "confirmed", label: "Confirmada" },
  { value: "deposited", label: "Con seña" },
  { value: "paid", label: "Pagada" },
  { value: "completed", label: "Finalizada" },
  { value: "cancelled", label: "Cancelada" },
];

const PAYMENT_OPTIONS = [
  { value: "pending", label: "Pendiente" },
  { value: "partial", label: "Parcial (seña)" },
  { value: "paid", label: "Pagado completo" },
];

function avatarColor(name: string) {
  const palette = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-pink-500", "bg-orange-500", "bg-teal-500", "bg-indigo-500"];
  return palette[name.charCodeAt(0) % palette.length];
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function formatDateTable(str: string) {
  const d = new Date(str);
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function extractTime(isoStr: string | null): string {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  return d.toTimeString().slice(0, 5);
}

type EditForm = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
  date: string;
  endDate: string;
  startTime: string;
  endTime: string;
  status: string;
  paymentStatus: string;
  totalAmount: string;
  depositAmount: string;
  paidAmount: string;
};

const inputCls = "w-full h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] px-3 text-sm text-white placeholder-slate-600 outline-none focus:border-brand-400/50 transition-all";
const labelCls = "block text-[11px] font-medium text-slate-400 mb-1";

function EditModal({
  booking,
  onClose,
  onSave,
}: {
  booking: Booking;
  onClose: () => void;
  onSave: (updated: Booking) => void;
}) {
  const [form, setForm] = useState<EditForm>({
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone ?? "",
    notes: booking.notes ?? "",
    date: booking.date.slice(0, 10),
    endDate: booking.endDate ? booking.endDate.slice(0, 10) : "",
    startTime: extractTime(booking.startTime),
    endTime: extractTime(booking.endTime),
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    totalAmount: String(booking.totalAmount),
    depositAmount: String(booking.depositAmount),
    paidAmount: String(booking.paidAmount ?? 0),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set =
    (key: keyof EditForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const isRange = booking.mode === "range";
  const needsTime = booking.mode === "hourly" || booking.mode === "appointment";

  async function handleSave() {
    if (!form.customerName.trim() || !form.customerEmail.trim() || !form.date) {
      setError("Nombre, email y fecha son obligatorios.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const body: Record<string, unknown> = {
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        customerPhone: form.customerPhone.trim() || null,
        notes: form.notes.trim() || null,
        date: `${form.date}T00:00:00`,
        status: form.status,
        paymentStatus: form.paymentStatus,
        totalAmount: parseFloat(form.totalAmount) || 0,
        depositAmount: parseFloat(form.depositAmount) || 0,
        paidAmount: parseFloat(form.paidAmount) || 0,
        endDate: form.endDate ? `${form.endDate}T00:00:00` : null,
        startTime: form.startTime ? `${form.date}T${form.startTime}:00` : null,
        endTime: form.endTime ? `${form.date}T${form.endTime}:00` : null,
      };

      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();

      onSave({
        ...booking,
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        customerPhone: form.customerPhone.trim() || null,
        notes: form.notes.trim() || null,
        date: body.date as string,
        endDate: body.endDate as string | null,
        startTime: body.startTime as string | null,
        endTime: body.endTime as string | null,
        status: form.status,
        paymentStatus: form.paymentStatus,
        totalAmount: parseFloat(form.totalAmount) || 0,
        depositAmount: parseFloat(form.depositAmount) || 0,
        paidAmount: parseFloat(form.paidAmount) || 0,
      });
      onClose();
    } catch {
      setError("Error al guardar los cambios.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-[#0c1230] border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] shrink-0">
          <h2 className="text-base font-bold text-white">Editar reserva</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/[0.06]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Negocio (readonly) */}
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3">
            {booking.business.coverUrl ? (
              <img
                src={booking.business.coverUrl}
                alt={booking.business.name}
                className="h-8 w-8 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-brand-500/20 flex items-center justify-center text-[10px] font-bold text-brand-300 flex-shrink-0">
                {booking.business.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{booking.business.name}</p>
              <p className="text-xs text-slate-500 truncate">{booking.resource.name}</p>
            </div>
          </div>

          {/* Cliente */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Cliente</p>
            <div>
              <label className={labelCls}>Nombre completo *</label>
              <input
                value={form.customerName}
                onChange={set("customerName")}
                className={inputCls}
                placeholder="Nombre completo"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Email *</label>
                <input
                  type="email"
                  value={form.customerEmail}
                  onChange={set("customerEmail")}
                  className={inputCls}
                  placeholder="email@ejemplo.com"
                />
              </div>
              <div>
                <label className={labelCls}>Teléfono</label>
                <input
                  type="tel"
                  value={form.customerPhone}
                  onChange={set("customerPhone")}
                  className={inputCls}
                  placeholder="+54 11 ..."
                />
              </div>
            </div>
          </div>

          {/* Fecha y horario */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Fecha y horario
            </p>
            <div className={`grid gap-3 ${needsTime ? "grid-cols-2" : "grid-cols-1"}`}>
              <div>
                <label className={labelCls}>{isRange ? "Desde" : "Fecha"} *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={set("date")}
                  className={inputCls}
                />
              </div>
              {isRange && (
                <div>
                  <label className={labelCls}>Hasta</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={set("endDate")}
                    min={form.date}
                    className={inputCls}
                  />
                </div>
              )}
            </div>
            {needsTime && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Hora inicio</label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={set("startTime")}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Hora fin</label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={set("endTime")}
                    className={inputCls}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Estado */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Estado</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Estado de la reserva</label>
                <select
                  value={form.status}
                  onChange={set("status")}
                  className={`${inputCls} cursor-pointer`}
                >
                  {STATUS_EDIT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-[#0c1230]">
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Estado del pago</label>
                <select
                  value={form.paymentStatus}
                  onChange={set("paymentStatus")}
                  className={`${inputCls} cursor-pointer`}
                >
                  {PAYMENT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-[#0c1230]">
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Montos */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Montos</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>Total</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.totalAmount}
                  onChange={set("totalAmount")}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Seña</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.depositAmount}
                  onChange={set("depositAmount")}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Pagado</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.paidAmount}
                  onChange={set("paidAmount")}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className={labelCls}>Notas adicionales</label>
            <textarea
              value={form.notes}
              onChange={set("notes")}
              rows={3}
              placeholder="Notas adicionales..."
              className="w-full rounded-xl bg-white/[0.05] border border-white/[0.08] px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-brand-400/50 transition-all resize-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-white/[0.08] shrink-0">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-white/[0.08] text-sm text-slate-400 hover:text-white hover:border-white/20 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 h-10 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Guardando...
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" /> Guardar cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReservasAdminPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setFetchError("");
    try {
      const url =
        user.role === "owner"
          ? `/api/bookings?ownerId=${user.id}`
          : "/api/bookings";
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setFetchError(data.error || "Error al cargar reservas");
        setBookings([]);
      } else {
        setBookings(Array.isArray(data) ? [...data].reverse() : []);
      }
    } catch {
      setFetchError("Error de conexión");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    try {
      await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    } finally {
      setUpdating(null);
    }
  }

  async function deleteBooking(id: string) {
    if (!confirm("¿Eliminar esta reserva? Esta acción no se puede deshacer.")) return;
    setDeleting(id);
    try {
      await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  function handleEditSave(updated: Booking) {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  }

  const today = new Date().toISOString().split("T")[0];
  const thisMonth = new Date().toISOString().slice(0, 7);

  const todayCount = bookings.filter(
    (b) => b.date.slice(0, 10) === today && b.status !== "cancelled"
  ).length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const monthCount = bookings.filter(
    (b) => b.date.slice(0, 7) === thisMonth && b.status !== "cancelled"
  ).length;
  const monthRevenue = bookings
    .filter(
      (b) =>
        b.date.slice(0, 7) === thisMonth &&
        ["confirmed", "deposited", "paid", "completed"].includes(b.status)
    )
    .reduce((s, b) => s + b.totalAmount, 0);

  const filtered = bookings.filter((b) => {
    const q = query.toLowerCase();
    const matchQ =
      !q ||
      b.customerName.toLowerCase().includes(q) ||
      b.customerEmail.toLowerCase().includes(q) ||
      b.business.name.toLowerCase().includes(q) ||
      b.resource.name.toLowerCase().includes(q);
    const matchStatus = !statusFilter || b.status === statusFilter;
    return matchQ && matchStatus;
  });

  const stats = [
    {
      label: "Reservas hoy",
      value: loading ? "—" : String(todayCount),
      icon: CalendarDays,
      iconBg: "bg-brand-500/15",
      iconColor: "text-brand-300",
    },
    {
      label: "Reservas este mes",
      value: loading ? "—" : String(monthCount),
      icon: Clock,
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-300",
    },
    {
      label: "Ingresos este mes",
      value: loading ? "—" : formatCurrency(monthRevenue),
      icon: TrendingUp,
      iconBg: "bg-green-500/15",
      iconColor: "text-green-300",
    },
    {
      label: "Pendientes",
      value: loading ? "—" : String(pendingCount),
      icon: Users,
      iconBg: "bg-orange-500/15",
      iconColor: "text-orange-300",
    },
  ];

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reservas</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Gestioná y administrá todas las reservas de tu negocio.
          </p>
        </div>
        <button
          onClick={fetchBookings}
          disabled={loading}
          className="flex items-center gap-2 h-9 px-4 rounded-xl border border-white/[0.08] text-sm text-slate-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </button>
      </div>

      {fetchError && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {fetchError}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/[0.06] bg-[#0a0f25] p-5 flex items-center gap-4"
          >
            <div
              className={`h-11 w-11 flex-shrink-0 flex items-center justify-center rounded-xl ${s.iconBg}`}
            >
              <s.icon className={`h-5 w-5 ${s.iconColor}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white leading-none">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por cliente, negocio o servicio..."
            className="w-full h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] pl-9 pr-9 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-400/50 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] px-3 text-sm text-slate-300 outline-none cursor-pointer"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-[#0a0f25]">
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0a0f25] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white">Todas las reservas</h2>
          <span className="text-xs text-slate-500">
            {loading
              ? "Cargando..."
              : `${filtered.length} resultado${filtered.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-slate-600 text-sm">
            <Loader2 className="h-5 w-5 animate-spin" />
            Cargando...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <CalendarDays className="h-10 w-10 text-slate-700 mb-3" />
            <p className="text-sm text-slate-500">
              Sin reservas{query || statusFilter ? " con ese filtro" : ""}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop column headers */}
            <div className="hidden lg:grid grid-cols-[1.4fr_1.2fr_1fr_1fr_110px_120px_100px] gap-4 min-w-[860px] px-6 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600 border-b border-white/[0.04]">
              <span>Cliente</span>
              <span>Negocio</span>
              <span>Recurso</span>
              <span>Fecha y Hora</span>
              <span>Estado</span>
              <span>Pago</span>
              <span>Acciones</span>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {filtered.map((b) => {
                const isUpdating = updating === b.id;
                const isDeleting = deleting === b.id;
                const canConfirm = b.status === "pending";
                const canComplete = b.status === "confirmed";

                const actionButtons = (
                  <div className="flex items-center gap-1.5">
                    {canConfirm && (
                      <button
                        disabled={isUpdating}
                        onClick={() => updateStatus(b.id, "confirmed")}
                        title="Confirmar reserva"
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500/15 hover:bg-green-500/25 text-green-400 transition-colors disabled:opacity-50"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {canComplete && (
                      <button
                        disabled={isUpdating}
                        onClick={() => updateStatus(b.id, "completed")}
                        title="Marcar como finalizada"
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 transition-colors disabled:opacity-50"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => setEditingBooking(b)}
                      title="Editar reserva"
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      disabled={isDeleting}
                      onClick={() => deleteBooking(b.id)}
                      title="Eliminar reserva"
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors disabled:opacity-40"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                );

                return (
                  <div key={b.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* ── Mobile card ── */}
                    <div className="lg:hidden p-4 space-y-3">
                      {/* Row 1: avatar + name + status */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`h-9 w-9 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white ${avatarColor(b.customerName)}`}
                          >
                            {initials(b.customerName)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {b.customerName}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{b.customerEmail}</p>
                            {b.customerPhone && (
                              <p className="text-[11px] text-slate-600 truncate">
                                {b.customerPhone}
                              </p>
                            )}
                          </div>
                        </div>
                        <span
                          className={`flex-shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full ${
                            STATUS_COLORS[b.status] ?? "bg-slate-500/15 text-slate-300"
                          }`}
                        >
                          {STATUS_LABELS[b.status] ?? b.status}
                        </span>
                      </div>

                      {/* Row 2: business + date */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          {b.business.coverUrl ? (
                            <img
                              src={b.business.coverUrl}
                              alt={b.business.name}
                              className="h-8 w-8 flex-shrink-0 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 flex-shrink-0 rounded-lg bg-brand-500/20 flex items-center justify-center text-[10px] font-bold text-brand-300">
                              {b.business.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {b.business.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{b.resource.name}</p>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className="flex items-center gap-1.5 text-xs text-white justify-end">
                            <CalendarDays className="h-3 w-3 text-slate-600" />
                            {formatDateTable(b.date)}
                          </div>
                          {b.startTime && (
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5 justify-end">
                              <Clock className="h-3 w-3 text-slate-600" />
                              {formatTime(b.startTime)}
                              {b.endTime ? ` - ${formatTime(b.endTime)}` : ""}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Row 3: amount + actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {formatCurrency(b.totalAmount)}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {b.paymentStatus === "paid"
                              ? "Pagado"
                              : b.depositAmount > 0
                              ? `Seña: ${formatCurrency(b.depositAmount)}`
                              : "Sin seña"}
                          </p>
                        </div>
                        {actionButtons}
                      </div>
                    </div>

                    {/* ── Desktop grid row ── */}
                    <div className="hidden lg:grid grid-cols-[1.4fr_1.2fr_1fr_1fr_110px_120px_100px] gap-4 min-w-[860px] items-center px-6 py-4">
                      {/* Cliente */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white ${avatarColor(b.customerName)}`}
                        >
                          {initials(b.customerName)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {b.customerName}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{b.customerEmail}</p>
                          {b.customerPhone && (
                            <p className="text-[11px] text-slate-600 truncate">
                              {b.customerPhone}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Negocio */}
                      <div className="flex items-center gap-2.5">
                        {b.business.coverUrl ? (
                          <img
                            src={b.business.coverUrl}
                            alt={b.business.name}
                            className="h-9 w-9 flex-shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-brand-500/20 flex items-center justify-center text-[10px] font-bold text-brand-300">
                            {b.business.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {b.business.name}
                          </p>
                          {b.business.category && (
                            <p className="text-xs text-slate-500 truncate">
                              {b.business.category.name}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Recurso */}
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">{b.resource.name}</p>
                        {b.resource.type && (
                          <p className="text-xs text-slate-500 truncate">{b.resource.type}</p>
                        )}
                      </div>

                      {/* Fecha y Hora */}
                      <div className="flex-shrink-0">
                        <div className="flex items-center gap-1.5 text-sm text-white">
                          <CalendarDays className="h-3.5 w-3.5 text-slate-600 flex-shrink-0" />
                          {formatDateTable(b.date)}
                        </div>
                        {b.startTime && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                            <Clock className="h-3 w-3 text-slate-600 flex-shrink-0" />
                            {formatTime(b.startTime)}
                            {b.endTime ? ` - ${formatTime(b.endTime)}` : " hs"}
                          </div>
                        )}
                      </div>

                      {/* Estado */}
                      <div className="flex-shrink-0">
                        <span
                          className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                            STATUS_COLORS[b.status] ?? "bg-slate-500/15 text-slate-300"
                          }`}
                        >
                          {STATUS_LABELS[b.status] ?? b.status}
                        </span>
                      </div>

                      {/* Pago */}
                      <div className="flex-shrink-0">
                        <p className="text-sm font-semibold text-white">
                          {formatCurrency(b.totalAmount)}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {b.status === "cancelled"
                            ? "Cancelado"
                            : b.paymentStatus === "paid"
                            ? "Pagado"
                            : b.depositAmount > 0
                            ? `Seña: ${formatCurrency(b.depositAmount)}`
                            : "Pendiente"}
                        </p>
                      </div>

                      {/* Acciones */}
                      <div className="flex-shrink-0">{actionButtons}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {editingBooking && (
        <EditModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}

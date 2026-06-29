"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Clock, Check, AlertCircle, LogIn, Loader2, ChevronLeft } from "lucide-react";

import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/app/context/AuthContext";

type Resource = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: number | null;
  capacity?: number | null;
};

type Biz = {
  id: string;
  name: string;
  bookingMode: string;
  resources: Resource[];
};

const ALL_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
];

function formatMonthYear(ym: string): string {
  const [y, m] = ym.split("-");
  return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleDateString("es-AR", {
    month: "long", year: "numeric",
  });
}

export default function BookingPanel({ biz }: { biz: Biz }) {
  const { user } = useAuth();
  const [selectedResource, setSelectedResource] = useState<Resource>(biz.resources[0]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [step, setStep] = useState<"select" | "confirm" | "done">("select");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [bookingResult, setBookingResult] = useState<{ id: string } | null>(null);
  const [calendarMonth, setCalendarMonth] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setCalendarMonth(d.calendarMonth ?? null))
      .catch(() => {});
  }, []);

  const minDate = calendarMonth ? `${calendarMonth}-01` : today;
  const maxDate = calendarMonth
    ? (() => {
        const [y, m] = calendarMonth.split("-").map(Number);
        return `${calendarMonth}-${new Date(y, m, 0).getDate().toString().padStart(2, "0")}`;
      })()
    : undefined;

  // Pre-fill from auth user
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Load availability when date or resource changes
  useEffect(() => {
    if (!selectedDate || !selectedResource?.id) return;
    if (biz.bookingMode !== "hourly" && biz.bookingMode !== "appointment") return;

    setLoadingSlots(true);
    setSelectedTime("");
    fetch(`/api/availability?resourceId=${selectedResource.id}&date=${selectedDate}`)
      .then((r) => r.json())
      .then((data) => {
        setBookedSlots(data.bookedSlots || []);
        setLoadingSlots(false);
      })
      .catch(() => setLoadingSlots(false));
  }, [selectedDate, selectedResource?.id, biz.bookingMode]);

  const needsTime = biz.bookingMode === "hourly" || biz.bookingMode === "appointment";
  const canProceed = selectedDate && (!needsTime || selectedTime);
  const canConfirm = canProceed && name.trim() && email.trim();

  async function handleConfirm() {
    if (!canConfirm) return;
    setSubmitting(true);
    setError("");

    const dateStr = selectedDate + "T00:00:00";
    let startTime: string | undefined;
    let endTime: string | undefined;

    if (selectedTime) {
      startTime = `${selectedDate}T${selectedTime}:00`;
      const [h, m] = selectedTime.split(":").map(Number);
      const durationMin = selectedResource.duration ?? 60;
      const endMinutes = h * 60 + m + durationMin;
      const eh = Math.floor(endMinutes / 60).toString().padStart(2, "0");
      const em = (endMinutes % 60).toString().padStart(2, "0");
      endTime = `${selectedDate}T${eh}:${em}:00`;
    }

    const body = {
      businessId: biz.id,
      resourceId: selectedResource.id,
      userId: user?.id ?? null,
      customerName: name,
      customerEmail: email,
      customerPhone: phone || null,
      notes: notes || null,
      date: dateStr,
      mode: biz.bookingMode,
      totalAmount: selectedResource.price,
      depositAmount: selectedResource.price * 0.25,
      status: "pending",
      ...(startTime ? { startTime, endTime } : {}),
    };

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error || "Error al confirmar la reserva");
      return;
    }

    setBookingResult(data);
    setStep("done");
  }

  function handleReset() {
    setStep("select");
    setSelectedDate("");
    setSelectedTime("");
    setNotes("");
    setError("");
    setBookingResult(null);
    if (!user) { setName(""); setEmail(""); setPhone(""); }
  }

  // Require login
  if (!user) {
    return (
      <div className="sticky top-20">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0a0f25] p-6 text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/15 mx-auto">
            <CalendarDays className="h-6 w-6 text-brand-300" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Reservar turno</h3>
            <p className="text-sm text-slate-400 mt-1">
              Iniciá sesión para poder hacer tu reserva
            </p>
          </div>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-brand-500 hover:bg-brand-400 text-sm font-semibold text-white transition-colors"
          >
            <LogIn className="h-4 w-4" />
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className="block text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            ¿No tenés cuenta? Registrarte gratis
          </Link>
        </div>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="sticky top-20">
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20 mx-auto mb-4">
            <Check className="h-7 w-7 text-green-400" />
          </div>
          <h3 className="text-lg font-bold text-white">¡Reserva enviada!</h3>
          <p className="text-sm text-slate-400 mt-2">
            Confirmación enviada a <span className="text-white font-medium">{email}</span>
          </p>
          <div className="mt-4 rounded-xl bg-white/[0.04] border border-white/[0.06] p-4 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Negocio</span>
              <span className="text-white font-medium">{biz.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Recurso</span>
              <span className="text-white font-medium">{selectedResource.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Fecha</span>
              <span className="text-white font-medium">
                {new Date(selectedDate + "T12:00:00").toLocaleDateString("es-AR", {
                  weekday: "long", day: "numeric", month: "long",
                })}
              </span>
            </div>
            {selectedTime && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Hora</span>
                <span className="text-white font-medium">{selectedTime} hs</span>
              </div>
            )}
            <div className="flex justify-between text-sm pt-2 border-t border-white/[0.06]">
              <span className="text-slate-500">Total</span>
              <span className="text-brand-300 font-bold">{formatCurrency(selectedResource.price)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Seña (25%)</span>
              <span className="text-white">{formatCurrency(selectedResource.price * 0.25)}</span>
            </div>
            {bookingResult?.id && (
              <div className="flex justify-between text-sm pt-1">
                <span className="text-slate-500">ID Reserva</span>
                <span className="text-slate-400 font-mono text-[10px]">{bookingResult.id.slice(0, 8)}...</span>
              </div>
            )}
          </div>
          <button
            onClick={handleReset}
            className="mt-4 w-full rounded-xl border border-white/[0.08] py-2.5 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Nueva reserva
          </button>
          <Link
            href="/mis-reservas"
            className="mt-2 block text-sm text-brand-300 hover:text-brand-200 transition-colors"
          >
            Ver mis reservas →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-20 space-y-3">
      <div className="rounded-2xl border border-white/[0.08] bg-[#0a0f25] p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Reservar turno</h3>
          <span className="text-xs text-slate-500 bg-white/[0.04] px-2 py-1 rounded-lg border border-white/[0.06]">
            {biz.bookingMode === "hourly" ? "Por hora" : biz.bookingMode === "appointment" ? "Por turno" : biz.bookingMode === "daily" ? "Por día" : "Por rango"}
          </span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => step === "confirm" && setStep("select")}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
              step === "select"
                ? "text-brand-300 cursor-default"
                : "text-slate-500 hover:text-slate-300 cursor-pointer"
            }`}
          >
            <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
              step === "select" ? "bg-brand-500 text-white" : "bg-white/[0.08] text-slate-400"
            }`}>1</span>
            Fecha y hora
          </button>
          <div className="flex-1 h-px bg-white/[0.08]" />
          <span className={`flex items-center gap-1.5 text-xs font-medium ${
            step === "confirm" ? "text-brand-300" : "text-slate-600"
          }`}>
            <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
              step === "confirm" ? "bg-brand-500 text-white" : "bg-white/[0.08] text-slate-600"
            }`}>2</span>
            Tus datos
          </span>
        </div>

        {/* Resource selector */}
        {biz.resources.length > 1 && (
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">
              {biz.bookingMode === "appointment" ? "Profesional / Servicio" : "Recurso"}
            </label>
            <div className="space-y-2">
              {biz.resources.map((res) => (
                <button
                  key={res.id}
                  onClick={() => { setSelectedResource(res); setSelectedTime(""); }}
                  className={`w-full flex items-center justify-between rounded-xl p-3 border text-left transition-all ${
                    selectedResource.id === res.id
                      ? "border-brand-500/50 bg-brand-500/10"
                      : "border-white/[0.08] bg-white/[0.03] hover:border-white/20"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-white">{res.name}</p>
                    {res.description && <p className="text-[11px] text-slate-500 mt-0.5">{res.description}</p>}
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    <p className="text-sm font-bold text-brand-300">{formatCurrency(res.price)}</p>
                    {res.duration && <p className="text-[10px] text-slate-600">{res.duration} min</p>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Date */}
        <div>
          <label className="text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            Fecha
            {calendarMonth && (
              <span className="ml-auto text-[10px] text-brand-400/80 font-normal">
                {formatMonthYear(calendarMonth)}
              </span>
            )}
          </label>
          <input
            type="date"
            min={minDate}
            max={maxDate}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full h-11 rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 text-sm text-white outline-none focus:border-brand-400/50 transition-all"
          />
          {calendarMonth && (
            <p className="text-[10px] text-slate-600 mt-1">
              Solo disponible en {formatMonthYear(calendarMonth)}
            </p>
          )}
        </div>

        {/* Time slots */}
        {needsTime && selectedDate && (
          <div>
            <label className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Horario disponible
              {loadingSlots && <Loader2 className="h-3 w-3 animate-spin ml-1" />}
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {ALL_SLOTS.map((slot) => {
                const booked = bookedSlots.includes(slot);
                const selected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    disabled={booked || loadingSlots}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 rounded-xl text-xs font-medium transition-all ${
                      booked
                        ? "bg-white/[0.02] text-slate-700 cursor-not-allowed line-through"
                        : selected
                        ? "bg-brand-500 text-white"
                        : "bg-white/[0.06] text-slate-300 hover:bg-white/[0.10] hover:text-white"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Summary */}
        {canProceed && (
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Precio</span>
              <span className="text-white">{formatCurrency(selectedResource.price)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Seña (25%)</span>
              <span className="text-white">{formatCurrency(selectedResource.price * 0.25)}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-white/[0.06] font-semibold">
              <span className="text-slate-300">Saldo restante</span>
              <span className="text-brand-300">{formatCurrency(selectedResource.price * 0.75)}</span>
            </div>
          </div>
        )}

        {/* Contact info (step confirm) */}
        {step === "confirm" && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400">Tus datos</p>
            <input
              placeholder="Nombre completo *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 text-sm text-white placeholder-slate-600 outline-none focus:border-brand-400/50 transition-all"
            />
            <input
              placeholder="Email *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 text-sm text-white placeholder-slate-600 outline-none focus:border-brand-400/50 transition-all"
            />
            <input
              placeholder="Teléfono (opcional)"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-11 rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 text-sm text-white placeholder-slate-600 outline-none focus:border-brand-400/50 transition-all"
            />
            <textarea
              placeholder="Notas adicionales (opcional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-brand-400/50 transition-all resize-none"
            />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
            {error}
          </p>
        )}

        {/* CTA */}
        {step === "select" ? (
          <button
            disabled={!canProceed}
            onClick={() => setStep("confirm")}
            className="w-full h-12 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold text-white transition-colors"
          >
            {!selectedDate
              ? "Seleccioná una fecha"
              : needsTime && !selectedTime
              ? "Seleccioná un horario"
              : "Continuar →"}
          </button>
        ) : (
          <div className="space-y-2">
            <button
              disabled={!canConfirm || submitting}
              onClick={handleConfirm}
              className="w-full h-12 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Confirmando...</>
              ) : (
                <><Check className="h-4 w-4" /> Confirmar reserva</>
              )}
            </button>
            <button
              onClick={() => { setStep("select"); setError(""); }}
              className="w-full h-10 rounded-xl border border-white/[0.08] text-sm text-slate-400 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-1.5"
            >
              <ChevronLeft className="h-4 w-4" />
              Volver al paso anterior
            </button>
          </div>
        )}

        {step === "select" && (
          <div className="flex items-start gap-2 text-xs text-slate-600">
            <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
            <span>No se realiza ningún cobro hasta confirmar la reserva</span>
          </div>
        )}
      </div>
    </div>
  );
}

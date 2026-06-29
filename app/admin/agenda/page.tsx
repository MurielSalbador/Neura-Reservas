"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/utils";

type Slot = {
  time: string;
  client: string;
  resource: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  duration: number;
};

const RESOURCES = ["Cancha 1", "Cancha 2", "Cancha 3"];

const SLOTS: Record<string, Slot[]> = {
  "18:00": [
    { time: "18:00", client: "Juan Pérez", resource: "Cancha 1", status: "confirmed", duration: 1 },
    { time: "18:00", client: "Ana Gómez", resource: "Cancha 2", status: "confirmed", duration: 1 },
  ],
  "19:00": [
    { time: "19:00", client: "Carlos López", resource: "Cancha 1", status: "pending", duration: 1 },
    { time: "19:00", client: "Pedro Ruiz", resource: "Cancha 3", status: "confirmed", duration: 1 },
  ],
  "20:00": [
    { time: "20:00", client: "María García", resource: "Cancha 2", status: "confirmed", duration: 1 },
  ],
  "21:00": [
    { time: "21:00", client: "Luis Martín", resource: "Cancha 1", status: "cancelled", duration: 1 },
    { time: "21:00", client: "Sofía Díaz", resource: "Cancha 3", status: "confirmed", duration: 1 },
  ],
};

const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];

const WEEK_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function getWeekDates(base: Date) {
  const day = base.getDay();
  const monday = new Date(base);
  monday.setDate(base.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"week" | "day">("week");
  const weekDates = getWeekDates(currentDate);
  const today = new Date().toDateString();

  function prevWeek() {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  }
  function nextWeek() {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  }

  return (
    <div className="space-y-4 max-w-5xl">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button onClick={prevWeek} className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={nextWeek} className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <h2 className="text-sm font-semibold text-white capitalize">
            {weekDates[0].toLocaleDateString("es-AR", { day: "numeric", month: "long" })} – {weekDates[6].toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
          </h2>
          <button onClick={() => setCurrentDate(new Date())} className="text-xs text-brand-300 hover:text-brand-200 transition-colors">
            Hoy
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-white/[0.08] overflow-hidden">
            {(["week", "day"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-medium transition-all ${view === v ? "bg-brand-500 text-white" : "text-slate-400 hover:text-white hover:bg-white/[0.06]"}`}
              >
                {v === "week" ? "Semana" : "Día"}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 rounded-xl bg-brand-500 hover:bg-brand-400 px-3 py-1.5 text-xs font-semibold text-white transition-colors">
            <Plus className="h-3.5 w-3.5" />
            Nueva reserva
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0a0f25] overflow-hidden">
        {/* Day headers */}
        <div className="grid border-b border-white/[0.06]" style={{ gridTemplateColumns: "60px repeat(7, 1fr)" }}>
          <div className="p-3" />
          {weekDates.map((date, i) => {
            const isToday = date.toDateString() === today;
            return (
              <div key={i} className={`p-3 text-center border-l border-white/[0.04] ${isToday ? "bg-brand-500/10" : ""}`}>
                <p className={`text-[10px] font-medium uppercase ${isToday ? "text-brand-300" : "text-slate-600"}`}>{WEEK_DAYS[i]}</p>
                <p className={`text-sm font-bold mt-0.5 ${isToday ? "text-brand-300" : "text-white"}`}>{date.getDate()}</p>
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        <div className="overflow-y-auto max-h-[520px]">
          {HOURS.map((hour) => {
            const slots = SLOTS[hour] || [];
            return (
              <div key={hour} className="grid border-b border-white/[0.03]" style={{ gridTemplateColumns: "60px repeat(7, 1fr)" }}>
                <div className="px-3 py-2 text-[10px] text-slate-700 font-medium tabular-nums">{hour}</div>
                {weekDates.map((date, di) => {
                  const isToday = date.toDateString() === today;
                  const daySlots = di === new Date().getDay() - 1 ? slots : [];
                  return (
                    <div key={di} className={`min-h-[52px] border-l border-white/[0.04] p-1 ${isToday ? "bg-brand-500/[0.04]" : ""}`}>
                      {daySlots.map((slot, si) => (
                        <div
                          key={si}
                          className={`mb-1 rounded-lg px-2 py-1.5 text-[10px] font-medium cursor-pointer hover:opacity-90 transition-opacity ${
                            slot.status === "confirmed" ? "bg-green-500/20 text-green-300" :
                            slot.status === "pending" ? "bg-yellow-500/20 text-yellow-300" :
                            slot.status === "cancelled" ? "bg-red-500/20 text-red-300" : "bg-slate-500/20 text-slate-300"
                          }`}
                        >
                          <p className="truncate font-semibold">{slot.client}</p>
                          <p className="truncate opacity-70">{slot.resource}</p>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4">
        {[
          { status: "confirmed", label: "Confirmada" },
          { status: "pending", label: "Pendiente" },
          { status: "cancelled", label: "Cancelada" },
        ].map((l) => (
          <div key={l.status} className="flex items-center gap-1.5">
            <div className={`h-2.5 w-2.5 rounded-sm ${STATUS_COLORS[l.status].split(" ")[0]}`} />
            <span className="text-xs text-slate-500">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

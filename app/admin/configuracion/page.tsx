"use client";

import { useState } from "react";
import { Save, Building2, Clock, CreditCard, Bell } from "lucide-react";

export default function ConfiguracionPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "Complejo La Superiora",
    description: "El mejor complejo de canchas de fútbol en Rosario.",
    address: "Av. Circunvalación 1234",
    city: "Rosario",
    province: "Santa Fe",
    phone: "+54 341 555-1001",
    email: "info@superiora.com",
    openTime: "08:00",
    closeTime: "24:00",
    slotDuration: "60",
    depositPct: "25",
    notifyEmail: true,
    notifyWhatsapp: false,
  });

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Business info */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0a0f25] overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
          <Building2 className="h-4 w-4 text-brand-300" />
          <h3 className="text-sm font-semibold text-white">Información del negocio</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Nombre del negocio</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 text-sm text-white outline-none focus:border-brand-400/50 transition-all" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Teléfono</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 text-sm text-white outline-none focus:border-brand-400/50 transition-all" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1.5">Descripción</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 py-3 text-sm text-white outline-none focus:border-brand-400/50 transition-all resize-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Dirección</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 text-sm text-white outline-none focus:border-brand-400/50 transition-all" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Ciudad</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 text-sm text-white outline-none focus:border-brand-400/50 transition-all" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1.5">Email de contacto</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 text-sm text-white outline-none focus:border-brand-400/50 transition-all" />
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0a0f25] overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
          <Clock className="h-4 w-4 text-brand-300" />
          <h3 className="text-sm font-semibold text-white">Horarios y disponibilidad</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Apertura</label>
              <input type="time" value={form.openTime} onChange={(e) => setForm({ ...form, openTime: e.target.value })} className="w-full h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 text-sm text-white outline-none focus:border-brand-400/50 transition-all" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Cierre</label>
              <input type="time" value={form.closeTime} onChange={(e) => setForm({ ...form, closeTime: e.target.value })} className="w-full h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 text-sm text-white outline-none focus:border-brand-400/50 transition-all" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1.5">Duración del turno (minutos)</label>
            <select value={form.slotDuration} onChange={(e) => setForm({ ...form, slotDuration: e.target.value })} className="w-full h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 text-sm text-slate-300 outline-none">
              <option value="30">30 minutos</option>
              <option value="60">60 minutos (1 hora)</option>
              <option value="90">90 minutos</option>
              <option value="120">120 minutos (2 horas)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0a0f25] overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
          <CreditCard className="h-4 w-4 text-brand-300" />
          <h3 className="text-sm font-semibold text-white">Pagos y señas</h3>
        </div>
        <div className="p-5">
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1.5">Porcentaje de seña requerida</label>
            <div className="flex items-center gap-3">
              <input type="range" min="0" max="100" step="5" value={form.depositPct} onChange={(e) => setForm({ ...form, depositPct: e.target.value })} className="flex-1 accent-brand-500" />
              <span className="text-sm font-bold text-white w-12 text-right">{form.depositPct}%</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">El cliente debe abonar el {form.depositPct}% para confirmar la reserva</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0a0f25] overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
          <Bell className="h-4 w-4 text-brand-300" />
          <h3 className="text-sm font-semibold text-white">Notificaciones</h3>
        </div>
        <div className="p-5 space-y-3">
          {[
            { key: "notifyEmail", label: "Notificaciones por email", desc: "Recibí confirmaciones y cancelaciones por email" },
            { key: "notifyWhatsapp", label: "Recordatorios por WhatsApp", desc: "Enviá recordatorios automáticos a tus clientes" },
          ].map((opt) => (
            <div key={opt.key} className="flex items-center justify-between gap-4 py-2">
              <div>
                <p className="text-sm font-medium text-white">{opt.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
              </div>
              <button
                onClick={() => setForm({ ...form, [opt.key]: !form[opt.key as "notifyEmail" | "notifyWhatsapp"] })}
                className={`relative h-6 w-11 rounded-full transition-colors ${form[opt.key as "notifyEmail" | "notifyWhatsapp"] ? "bg-brand-500" : "bg-white/[0.12]"}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${form[opt.key as "notifyEmail" | "notifyWhatsapp"] ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${saved ? "bg-green-500 text-white" : "bg-brand-500 hover:bg-brand-400 text-white"}`}
      >
        <Save className="h-4 w-4" />
        {saved ? "¡Guardado!" : "Guardar cambios"}
      </button>
    </div>
  );
}

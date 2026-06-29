import { Bell, CheckCircle2, CalendarDays, AlertCircle } from "lucide-react";

const notifications = [
  { id: "1", type: "confirmed", title: "Reserva confirmada", desc: "Tu reserva en Complejo La Superiora para el 28 Jun a las 20:00 hs fue confirmada.", time: "Hace 2 horas", read: false },
  { id: "2", type: "reminder", title: "Recordatorio", desc: "Mañana tenés turno en Studio Hair a las 11:00 hs.", time: "Hace 5 horas", read: false },
  { id: "3", type: "pending", title: "Pago pendiente", desc: "Tenés un saldo pendiente de $9.000 para tu reserva en Salón Imperial.", time: "Ayer", read: true },
  { id: "4", type: "confirmed", title: "Seña recibida", desc: "Recibimos tu seña de $50.000 para el Salón Imperial.", time: "Hace 2 días", read: true },
];

const typeConfig: Record<string, { icon: typeof Bell; color: string }> = {
  confirmed: { icon: CheckCircle2, color: "bg-green-500/15 text-green-400" },
  reminder: { icon: CalendarDays, color: "bg-brand-500/15 text-brand-400" },
  pending: { icon: AlertCircle, color: "bg-yellow-500/15 text-yellow-400" },
};

export default function NotificacionesPage() {
  return (
    <div className="px-6 py-6 space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Notificaciones</h1>
        <button className="text-sm text-brand-300 hover:text-brand-200 transition-colors">Marcar todo como leído</button>
      </div>
      <div className="space-y-2">
        {notifications.map((n) => {
          const { icon: Icon, color } = typeConfig[n.type] ?? typeConfig.confirmed;
          return (
            <div key={n.id} className={`flex gap-4 rounded-2xl border p-4 transition-colors ${n.read ? "border-white/[0.06] bg-[#0a0f25]/60" : "border-brand-500/20 bg-brand-500/[0.04]"}`}>
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{n.title}</p>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-brand-400 flex-shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.desc}</p>
                <p className="text-[11px] text-slate-600 mt-2">{n.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { TrendingUp, BarChart3, PieChart, Download } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const monthlyRevenue = [
  { month: "Ene", amount: 85000, bookings: 38 },
  { month: "Feb", amount: 92000, bookings: 42 },
  { month: "Mar", amount: 110000, bookings: 51 },
  { month: "Abr", amount: 98000, bookings: 45 },
  { month: "May", amount: 125000, bookings: 58 },
  { month: "Jun", amount: 145000, bookings: 67 },
];

const topClients = [
  { name: "Roberto Silva", bookings: 15, spent: 225000 },
  { name: "Juan Pérez", bookings: 12, spent: 144000 },
  { name: "Carlos López", bookings: 8, spent: 96000 },
  { name: "Luis Martín", bookings: 7, spent: 84000 },
  { name: "Ana Martínez", bookings: 5, spent: 60000 },
];

const resourceStats = [
  { name: "Cancha 1", bookings: 42, revenue: 504000, pct: 70 },
  { name: "Cancha 2", bookings: 35, revenue: 525000, pct: 58 },
  { name: "Cancha 3", bookings: 20, revenue: 400000, pct: 33 },
];

const maxAmount = Math.max(...monthlyRevenue.map((m) => m.amount));

export default function ReportesPage() {
  const totalRevenue = monthlyRevenue.reduce((s, m) => s + m.amount, 0);
  const totalBookings = monthlyRevenue.reduce((s, m) => s + m.bookings, 0);

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Reportes</h2>
          <p className="text-xs text-slate-500 mt-0.5">Últimos 6 meses · Ene — Jun 2026</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-white/[0.08] px-3 py-1.5 text-sm text-slate-400 hover:text-white transition-colors">
          <Download className="h-4 w-4" />
          Exportar
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Ingresos totales", value: formatCurrency(totalRevenue), icon: TrendingUp, color: "text-green-400" },
          { label: "Total reservas", value: totalBookings.toString(), icon: BarChart3, color: "text-brand-400" },
          { label: "Ticket promedio", value: formatCurrency(totalRevenue / totalBookings), icon: PieChart, color: "text-purple-400" },
          { label: "Clientes únicos", value: "48", icon: TrendingUp, color: "text-orange-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/[0.06] bg-[#0a0f25] p-4">
            <s.icon className={`h-5 w-5 mb-3 ${s.color}`} />
            <p className="text-xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0a0f25] p-5">
        <h3 className="text-sm font-semibold text-white mb-5">Ingresos mensuales</h3>
        <div className="flex items-end gap-3 h-36">
          {monthlyRevenue.map((m) => {
            const h = Math.round((m.amount / maxAmount) * 100);
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] text-slate-500">{formatCurrency(m.amount / 1000)}k</span>
                <div className="w-full relative">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-brand-400 transition-all"
                    style={{ height: `${h * 0.7}px` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{m.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Top clients */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0a0f25] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white">Clientes frecuentes</h3>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {topClients.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3 px-5 py-3">
                <span className="text-xs font-bold text-slate-600 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.bookings} reservas</p>
                </div>
                <span className="text-sm font-bold text-brand-300">{formatCurrency(c.spent)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resource performance */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0a0f25] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white">Rendimiento por recurso</h3>
          </div>
          <div className="p-5 space-y-4">
            {resourceStats.map((r) => (
              <div key={r.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="text-sm font-medium text-white">{r.name}</span>
                    <span className="text-xs text-slate-600 ml-2">· {r.bookings} reservas</span>
                  </div>
                  <span className="text-sm font-bold text-brand-300">{formatCurrency(r.revenue)}</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${r.pct}%` }} />
                </div>
                <p className="text-[10px] text-slate-600 mt-1">{r.pct}% de ocupación</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

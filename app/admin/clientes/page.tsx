"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, X, Mail, Phone, User } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  bookingCount: number;
  lastBooking: { date: string; status: string; totalAmount: number } | null;
};

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Client | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users", { cache: "no-store" });
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch {
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filtered = clients.filter(
    (c) =>
      !query ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-white">Clientes</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {loading ? "Cargando..." : `${clients.length} usuarios registrados`}
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar cliente..."
            className="w-52 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] pl-9 pr-9 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-400/50 transition-all"
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
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">
        {/* List */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0a0f25] overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-600 text-sm">Cargando...</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <User className="h-10 w-10 text-slate-700 mb-3" />
              <p className="text-sm text-slate-500">
                {query ? "Sin resultados" : "Sin clientes registrados"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {filtered.map((client) => {
                const active = selected?.id === client.id;
                return (
                  <div
                    key={client.id}
                    onClick={() => setSelected(active ? null : client)}
                    className={`flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-colors ${
                      active ? "bg-brand-500/10" : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="h-9 w-9 flex-shrink-0 rounded-full bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-300">
                      {client.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white truncate">{client.name}</p>
                        {client.role === "owner" && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300">
                            Owner
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{client.email}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-5 flex-shrink-0">
                      <div className="text-center">
                        <p className="text-sm font-bold text-white">{client.bookingCount}</p>
                        <p className="text-[10px] text-slate-600">reservas</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-400">
                          {client.lastBooking ? formatDate(client.lastBooking.date) : "—"}
                        </p>
                        <p className="text-[10px] text-slate-600">última reserva</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected ? (
          <div className="rounded-2xl border border-white/[0.06] bg-[#0a0f25] p-5 space-y-4 self-start">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-brand-500/20 flex items-center justify-center text-sm font-bold text-brand-300">
                {selected.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{selected.name}</p>
                <p className="text-xs text-slate-500">
                  Registrado el {formatDate(selected.createdAt)}
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Mail className="h-3.5 w-3.5 text-slate-600" />
                {selected.email}
              </div>
              {selected.phone && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Phone className="h-3.5 w-3.5 text-slate-600" />
                  {selected.phone}
                </div>
              )}
            </div>

            <div className="rounded-xl bg-white/[0.04] p-3 text-center border border-white/[0.06]">
              <p className="text-2xl font-bold text-white">{selected.bookingCount}</p>
              <p className="text-xs text-slate-500 mt-0.5">Reservas totales</p>
            </div>

            {selected.lastBooking && (
              <div className="rounded-xl bg-white/[0.04] p-3 border border-white/[0.06] space-y-1">
                <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">Última reserva</p>
                <p className="text-sm text-white">{formatDate(selected.lastBooking.date)}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.06] bg-[#0a0f25] p-5 flex flex-col items-center justify-center text-center min-h-[200px] self-start">
            <User className="h-8 w-8 text-slate-700 mb-3" />
            <p className="text-sm text-slate-500">Seleccioná un cliente para ver sus detalles</p>
          </div>
        )}
      </div>
    </div>
  );
}

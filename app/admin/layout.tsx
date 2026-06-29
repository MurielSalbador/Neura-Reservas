"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, Building2, ChevronLeft, LogOut } from "lucide-react";
import AdminGuard from "@/components/layout/AdminGuard";
import { useAuth } from "@/app/context/AuthContext";

const adminNav = [
  { href: "/admin/reservas", label: "Reservas", icon: CalendarDays },
  { href: "/admin/nueva-reserva", label: "Negocios", icon: Building2 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#050811]">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-screen w-[220px] flex flex-col border-r border-white/[0.06] bg-[#060918] z-30">
          {/* Logo */}
          <div className="px-5 py-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 shadow-lg flex-shrink-0">
                <CalendarDays className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-white leading-none">TuReserva</p>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-none">Panel de Administración</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="px-3 pt-4 space-y-0.5 flex-1">
            {adminNav.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                    active
                      ? "bg-brand-500/20 text-white font-medium"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <Icon
                    className={`h-[18px] w-[18px] flex-shrink-0 ${active ? "text-brand-300" : ""}`}
                  />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Back link */}
          <div className="px-4 pb-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-300 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
          </div>

          {/* User */}
          {user && (
            <div className="p-3 border-t border-white/[0.06]">
              <div className="flex items-center gap-2.5 px-2 py-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate leading-tight">{user.name}</p>
                  <p className="text-[10px] text-slate-500 truncate leading-tight">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  className="text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* Content */}
        <div className="ml-[220px] flex-1">
          <main className="p-6 min-h-screen">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}

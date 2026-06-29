"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, Compass, Home, Building2, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/explorar", label: "Explorar", icon: Compass },
  { href: "/mis-reservas", label: "Mis Reservas", icon: CalendarDays },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] flex flex-col border-r border-white/[0.06] bg-[#060918] z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 shadow-lg flex-shrink-0">
          <CalendarDays className="h-5 w-5 text-white" />
        </div>
        <p className="text-[15px] font-semibold text-white">TuReserva</p>
      </div>

      {/* Main nav */}
      <nav className="px-3 pt-4 space-y-0.5 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => {
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
              <Icon className={`h-[18px] w-[18px] flex-shrink-0 ${active ? "text-brand-300" : ""}`} />
              {label}
            </Link>
          );
        })}

        {user?.role === "admin" && (
          <Link
            href="/admin/reservas"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all mt-4 ${
              pathname.startsWith("/admin")
                ? "bg-brand-500/20 text-white font-medium"
                : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            <Building2
              className={`h-[18px] w-[18px] flex-shrink-0 ${pathname.startsWith("/admin") ? "text-brand-300" : ""}`}
            />
            Panel Admin
          </Link>
        )}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-white/[0.06]">
        {user ? (
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <p className="text-sm font-medium text-white truncate flex-1">{user.name.split(" ")[0]}</p>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-brand-500 hover:bg-brand-400 py-2.5 text-xs font-semibold text-white transition-colors"
            >
              <LogIn className="h-3.5 w-3.5" />
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="flex items-center justify-center w-full rounded-xl border border-white/[0.08] py-2.5 text-xs font-medium text-slate-400 hover:text-white hover:border-white/20 transition-all"
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}

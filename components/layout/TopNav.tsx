"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, LogOut, User, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function TopNav() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/explorar?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleLogout() {
    logout();
    router.push("/login");
    setDropdownOpen(false);
  }

  const initials = user
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-white/[0.06] bg-[#060918]/80 backdrop-blur-xl px-6 h-16">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar negocios o servicios..."
          className="w-full h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-400/50 focus:bg-white/[0.08] transition-all"
        />
      </form>

      {/* User */}
      {user ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 hover:bg-white/[0.06] transition-all"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-xs font-bold text-white">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs text-slate-400 leading-none">Hola,</p>
              <p className="text-sm font-medium text-white leading-tight">{user.name.split(" ")[0]}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-white/[0.08] bg-[#0a0f25] shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                {user.role === "admin" && (
                  <span className="mt-1 inline-block text-[10px] font-semibold text-brand-300 bg-brand-500/15 px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <div className="p-1">
                <Link
                  href="/mis-reservas"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
                >
                  <User className="h-4 w-4" />
                  Mis reservas
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link
          href="/login"
          className="flex items-center gap-2 h-9 rounded-xl bg-brand-500 hover:bg-brand-400 px-4 text-sm font-semibold text-white transition-colors"
        >
          <LogIn className="h-4 w-4" />
          Ingresar
        </Link>
      )}
    </header>
  );
}

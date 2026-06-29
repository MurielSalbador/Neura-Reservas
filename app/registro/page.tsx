"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function RegistroPage() {
  const { register, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setError("");
    setLoading(true);
    const result = await register(name, email, password, phone || undefined);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.replace("/");
    }
  }

  return (
    <div className="min-h-screen bg-[#050811] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 shadow-lg">
            <CalendarDays className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">TuReserva</p>
            <p className="text-xs text-slate-500">Plataforma de Reservas</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0a0f25] p-6 space-y-5">
          <div>
            <h1 className="text-xl font-bold text-white">Crear cuenta</h1>
            <p className="text-sm text-slate-500 mt-1">Registrate para hacer reservas</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Nombre completo *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className="w-full h-11 rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-400/50 transition-all"
            />
            <input
              type="email"
              placeholder="Email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full h-11 rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-400/50 transition-all"
            />
            <input
              type="tel"
              placeholder="Teléfono (opcional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              className="w-full h-11 rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-400/50 transition-all"
            />
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Contraseña * (mín. 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full h-11 rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 pr-11 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-400/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-white transition-colors"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="text-brand-300 hover:text-brand-200 font-medium transition-colors">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

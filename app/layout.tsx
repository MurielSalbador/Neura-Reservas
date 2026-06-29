import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/app/context/AuthContext";
import LayoutShell from "@/components/layout/LayoutShell";

export const metadata: Metadata = {
  title: "TuReserva - Plataforma de Reservas",
  description: "Reservá canchas, salones, peluquerías y más de forma rápida y segura.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#050811] text-white">
        <AuthProvider>
          <LayoutShell>{children}</LayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}

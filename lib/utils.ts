export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatTime(date: Date | string): string {
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(date));
}

export function formatDateShort(date: Date | string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  deposited: "Señada",
  paid: "Pagada",
  cancelled: "Cancelada",
  completed: "Finalizada",
};

export const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-300 ring-1 ring-yellow-500/30",
  confirmed: "bg-green-500/15 text-green-300 ring-1 ring-green-500/30",
  deposited: "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30",
  paid: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  cancelled: "bg-red-500/15 text-red-300 ring-1 ring-red-500/30",
  completed: "bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30",
};

export const BOOKING_MODE_LABELS: Record<string, string> = {
  hourly: "Por hora",
  appointment: "Por turno",
  daily: "Por día",
  range: "Por rango",
};

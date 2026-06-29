"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus, Pencil, Trash2, Loader2, X, Check, ImageIcon,
  MapPin, AlertCircle, Search, Building2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
  icon: string;
  slug: string;
};

type Business = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverUrl: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  phone: string | null;
  email: string | null;
  minPrice: number;
  bookingMode: string;
  isActive: boolean;
  isFeatured: boolean;
  tag: string | null;
  category: { id: string; name: string; icon: string };
};

const MODE_LABELS: Record<string, string> = {
  hourly: "Por hora",
  appointment: "Por turno",
  daily: "Por día",
  range: "Por rango",
};

const BOOKING_MODES = [
  { value: "appointment", label: "Por turno" },
  { value: "hourly", label: "Por hora" },
  { value: "daily", label: "Por día" },
  { value: "range", label: "Por rango de días" },
];

const inputCls =
  "w-full h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] px-3 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-400/50 transition-all";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5";

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type FormState = {
  name: string;
  slug: string;
  description: string;
  coverUrl: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  minPrice: string;
  bookingMode: string;
  categoryId: string;
  tag: string;
  isFeatured: boolean;
  isActive: boolean;
};

const emptyForm: FormState = {
  name: "",
  slug: "",
  description: "",
  coverUrl: "",
  address: "",
  city: "",
  province: "",
  phone: "",
  email: "",
  minPrice: "",
  bookingMode: "appointment",
  categoryId: "",
  tag: "",
  isFeatured: false,
  isActive: true,
};

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" onClick={() => onChange(!value)} className="flex items-center gap-2">
      <div className={`h-5 w-9 rounded-full transition-colors relative flex-shrink-0 ${value ? "bg-brand-500" : "bg-white/[0.1]"}`}>
        <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
      </div>
      <span className="text-sm text-slate-400">{label}</span>
    </button>
  );
}

export default function NegociosPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Business | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [confirmDelete, setConfirmDelete] = useState<Business | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [bizRes, catRes] = await Promise.all([
        fetch("/api/businesses"),
        fetch("/api/categories"),
      ]);
      const [bizData, catData] = await Promise.all([bizRes.json(), catRes.json()]);
      setBusinesses(Array.isArray(bizData) ? bizData : []);
      setCategories(Array.isArray(catData) ? catData : []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm, categoryId: categories[0]?.id ?? "" });
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(biz: Business) {
    setEditing(biz);
    setForm({
      name: biz.name,
      slug: biz.slug,
      description: biz.description ?? "",
      coverUrl: biz.coverUrl ?? "",
      address: biz.address ?? "",
      city: biz.city ?? "",
      province: biz.province ?? "",
      phone: biz.phone ?? "",
      email: biz.email ?? "",
      minPrice: String(biz.minPrice || ""),
      bookingMode: biz.bookingMode,
      categoryId: biz.category.id,
      tag: biz.tag ?? "",
      isFeatured: biz.isFeatured,
      isActive: biz.isActive,
    });
    setFormError("");
    setModalOpen(true);
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "name" && !editing) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  }

  async function handleSave() {
    if (!form.name.trim() || !form.categoryId || !form.bookingMode) {
      setFormError("Completá nombre, categoría y tipo de reserva");
      return;
    }
    setSaving(true);
    setFormError("");
    const body = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name.trim()),
      description: form.description.trim() || null,
      coverUrl: form.coverUrl.trim() || null,
      address: form.address.trim() || null,
      city: form.city.trim() || null,
      province: form.province.trim() || null,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      minPrice: parseFloat(form.minPrice) || 0,
      bookingMode: form.bookingMode,
      categoryId: form.categoryId,
      tag: form.tag.trim() || null,
      isFeatured: form.isFeatured,
      isActive: form.isActive,
    };
    try {
      const res = editing
        ? await fetch(`/api/businesses/${editing.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
        : await fetch("/api/businesses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
      if (!res.ok) {
        const d = await res.json();
        setFormError(d.error ?? "Error al guardar");
      } else {
        setModalOpen(false);
        load();
      }
    } catch {
      setFormError("Error de conexión");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await fetch(`/api/businesses/${id}`, { method: "DELETE" });
      setBusinesses((bs) => bs.filter((b) => b.id !== id));
    } catch {}
    setDeletingId(null);
    setConfirmDelete(null);
  }

  const filtered = businesses.filter(
    (b) =>
      !search ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      (b.city ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">Negocios</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {businesses.length} negocio{businesses.length !== 1 ? "s" : ""} registrados
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 h-10 px-5 rounded-xl bg-brand-500 hover:bg-brand-400 text-sm font-semibold text-white transition-colors flex-shrink-0"
        >
          <Plus className="h-4 w-4" /> Crear nuevo
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar negocio..."
          className="w-full h-10 pl-9 pr-4 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-slate-500 outline-none focus:border-brand-400/50 transition-all"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24 gap-2 text-slate-600 text-sm">
          <Loader2 className="h-5 w-5 animate-spin" /> Cargando...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
            <Building2 className="h-7 w-7 text-slate-600" />
          </div>
          <div className="text-center">
            <p className="text-slate-400 font-medium">No hay negocios todavía</p>
            <p className="text-slate-600 text-sm mt-1">Creá el primero haciendo clic en &quot;Crear nuevo&quot;</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((biz) => (
            <div
              key={biz.id}
              className="rounded-2xl border border-white/[0.06] bg-[#0a0f25] overflow-hidden group flex flex-col"
            >
              {/* Cover */}
              <div className="relative h-40 bg-[#0c1230] flex-shrink-0">
                {biz.coverUrl ? (
                  <img src={biz.coverUrl} alt={biz.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-slate-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Status + Tag badges */}
                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                  {!biz.isActive && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900/80 text-slate-400 backdrop-blur-sm">
                      Inactivo
                    </span>
                  )}
                  {biz.isFeatured && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/90 text-white">
                      Destacado
                    </span>
                  )}
                  {biz.tag && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-500/90 text-white">
                      {biz.tag}
                    </span>
                  )}
                </div>

                {/* Hover action buttons */}
                <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(biz)}
                    title="Editar"
                    className="h-7 w-7 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(biz)}
                    title="Eliminar"
                    className="h-7 w-7 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col flex-1 gap-2">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white leading-snug">{biz.name}</p>
                  {biz.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{biz.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-slate-400">
                    {biz.category.icon} {biz.category.name}
                  </span>
                  {biz.city && (
                    <>
                      <span className="text-slate-700">·</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-0.5">
                        <MapPin className="h-3 w-3" /> {biz.city}
                      </span>
                    </>
                  )}
                  <span className="text-slate-700">·</span>
                  <span className="text-[11px] text-brand-400">{MODE_LABELS[biz.bookingMode] ?? biz.bookingMode}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
                  <span className="text-sm font-bold text-white">
                    {biz.minPrice > 0 ? `desde ${formatCurrency(biz.minPrice)}` : "A consultar"}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(biz)}
                      className="h-7 px-3 rounded-lg border border-white/[0.08] text-xs text-slate-400 hover:text-white hover:border-white/20 transition-all"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setConfirmDelete(biz)}
                      className="h-7 px-3 rounded-lg border border-red-500/20 text-xs text-red-500/60 hover:text-red-400 hover:border-red-500/40 transition-all"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-white/[0.08] bg-[#060918] shadow-2xl mb-8">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <h2 className="text-base font-semibold text-white">
                {editing ? "Editar negocio" : "Crear nuevo negocio"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* Name + Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Nombre *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    placeholder="Ej: Complejo La Superiora"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Slug (URL amigable)</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setField("slug", e.target.value)}
                    placeholder="complejo-la-superiora"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={labelCls}>Descripción</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  rows={3}
                  placeholder="Describí el negocio, sus servicios y características principales..."
                  className="w-full rounded-xl bg-white/[0.05] border border-white/[0.08] px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-400/50 transition-all resize-none"
                />
              </div>

              {/* Category + Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Categoría *</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setField("categoryId", e.target.value)}
                    className={`${inputCls} cursor-pointer`}
                  >
                    <option value="" className="bg-[#0c1230]">— Seleccioná —</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-[#0c1230]">
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Tipo de reserva *</label>
                  <select
                    value={form.bookingMode}
                    onChange={(e) => setField("bookingMode", e.target.value)}
                    className={`${inputCls} cursor-pointer`}
                  >
                    {BOOKING_MODES.map((m) => (
                      <option key={m.value} value={m.value} className="bg-[#0c1230]">
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price + Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Precio base (desde $)</label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={form.minPrice}
                    onChange={(e) => setField("minPrice", e.target.value)}
                    placeholder="0"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Etiqueta / Tag</label>
                  <input
                    value={form.tag}
                    onChange={(e) => setField("tag", e.target.value)}
                    placeholder="Nuevo, Popular, Oferta..."
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Cover */}
              <div>
                <label className={labelCls}>URL de imagen de portada</label>
                <input
                  value={form.coverUrl}
                  onChange={(e) => setField("coverUrl", e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className={inputCls}
                />
                {form.coverUrl && (
                  <div className="mt-2 h-20 w-full rounded-xl overflow-hidden border border-white/[0.06]">
                    <img src={form.coverUrl} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <label className={labelCls}>Ubicación</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    value={form.city}
                    onChange={(e) => setField("city", e.target.value)}
                    placeholder="Ciudad"
                    className={inputCls}
                  />
                  <input
                    value={form.province}
                    onChange={(e) => setField("province", e.target.value)}
                    placeholder="Provincia"
                    className={inputCls}
                  />
                  <input
                    value={form.address}
                    onChange={(e) => setField("address", e.target.value)}
                    placeholder="Dirección"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Contact */}
              <div>
                <label className={labelCls}>Contacto</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder="Teléfono"
                    className={inputCls}
                  />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="Email"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-6 pt-1">
                <Toggle value={form.isActive} onChange={(v) => setField("isActive", v)} label="Activo" />
                <Toggle value={form.isFeatured} onChange={(v) => setField("isFeatured", v)} label="Destacado" />
              </div>

              {formError && (
                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {formError}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 justify-end px-6 pb-6">
              <button
                onClick={() => setModalOpen(false)}
                className="h-10 px-5 rounded-xl border border-white/[0.08] text-sm text-slate-400 hover:text-white transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="h-10 px-6 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-sm font-semibold text-white transition-colors flex items-center gap-2"
              >
                {saving
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</>
                  : <><Check className="h-4 w-4" /> {editing ? "Guardar cambios" : "Crear negocio"}</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#060918] p-6 space-y-4 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-red-500/15 flex items-center justify-center flex-shrink-0">
                <Trash2 className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">¿Eliminar &quot;{confirmDelete.name}&quot;?</p>
                <p className="text-xs text-slate-500 mt-1">
                  El negocio se desactivará y dejará de ser visible para los clientes.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="h-9 px-4 rounded-xl border border-white/[0.08] text-sm text-slate-400 hover:text-white transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.id)}
                disabled={!!deletingId}
                className="h-9 px-5 rounded-xl bg-red-500 hover:bg-red-400 disabled:opacity-50 text-sm font-semibold text-white transition-colors flex items-center gap-2"
              >
                {deletingId
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Trash2 className="h-3.5 w-3.5" />
                }
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

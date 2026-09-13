import { useMemo, useState } from "react";
import { cn } from "../Utils/Cn";
import type { Nav } from "../Utils/types";
import {
  CATEGORIES,
  COLORS,
  TAG_LABEL,
  formatPrice,
  type CategoryKey,
  type ColorKey,
  type Product,
  type Tag,
} from "../Data/Products";
import { addProduct, removeProduct, resetProducts, updateProduct, useProducts } from "../Data/Store";
import {
  IconCheck,
  IconEdit,
  IconFlower,
  IconLock,
  IconPlus,
  IconTrash,
  IconX,
  Overline,
} from "../Components/Ui";

const ADMIN_LOGIN = "admin";
const ADMIN_PASSWORD = "1234";
const AUTH_KEY = "gullar-admin-auth";

type FormState = {
  name: string;
  category: CategoryKey;
  price: string;
  oldPrice: string;
  rating: string;
  reviews: string;
  colors: ColorKey[];
  tag: Tag | "none";
  img: string;
  short: string;
  desc: string;
  composition: string;
  stock: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  category: CATEGORIES[0].key,
  price: "",
  oldPrice: "",
  rating: "5",
  reviews: "0",
  colors: [],
  tag: "none",
  img: "",
  short: "",
  desc: "",
  composition: "",
  stock: "10",
};

function productToForm(p: Product): FormState {
  return {
    name: p.name,
    category: p.category,
    price: String(p.price),
    oldPrice: p.oldPrice ? String(p.oldPrice) : "",
    rating: String(p.rating),
    reviews: String(p.reviews),
    colors: p.colors,
    tag: p.tag ?? "none",
    img: p.img,
    short: p.short,
    desc: p.desc,
    composition: p.composition.join("\n"),
    stock: String(p.stock),
  };
}

const labelCls = "text-xs font-extrabold tracking-[0.2em] uppercase";

const inputCls =
  "mt-2 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm focus:border-terra focus:outline-none";

export function Admin({ nav }: { nav: Nav }) {
  // Vercel/brauzerda birinchi marta kirganda ham login so'ramaydi
  const [unlocked, setUnlocked] = useState(true);
  const [login, setLogin] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdError, setPwdError] = useState(false);

  const products = useProducts();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const sortedProducts = useMemo(() => [...products].sort((a, b) => b.id - a.id), [products]);

  const unlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD && login === ADMIN_LOGIN) {
      sessionStorage.setItem(AUTH_KEY, "1");
      setUnlocked(true);
      setPwdError(false);
      setLoginError(false);
    } else {
      setPwdError(true);
      setLoginError(true);
    }
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setForm(productToForm(p));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleColor = (c: ColorKey) =>
    setForm((f) => ({
      ...f,
      colors: f.colors.includes(c) ? f.colors.filter((x) => x !== c) : [...f.colors, c],
    }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Omit<Product, "id"> = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price) || 0,
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      rating: Math.min(5, Math.max(0, Number(form.rating) || 0)),
      reviews: Number(form.reviews) || 0,
      colors: form.colors,
      tag: form.tag === "none" ? undefined : form.tag,
      img: form.img.trim(),
      short: form.short.trim(),
      desc: form.desc.trim(),
      composition: form.composition
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      stock: Number(form.stock) || 0,
    };

    if (editingId != null) {
      updateProduct(editingId, data);
    } else {
      addProduct(data);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const doDelete = (id: number) => {
    removeProduct(id);
    setConfirmDeleteId(null);
    if (editingId === id) {
      setEditingId(null);
      setForm(EMPTY_FORM);
    }
  };

  /* ================= PASSWORD GATE ================= */
  if (!unlocked) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-20 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-leaf text-cream">
          <IconLock className="h-7 w-7" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">Admin panel</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Guldastalarni qo'shish, tahrirlash yoki o'chirish uchun login va parolni kiriting.
        </p>
        <form onSubmit={unlock} className="mt-8 w-full space-y-3">
          <input
            type="text"
            autoFocus
            value={login}
            onChange={(e) => {
              setLogin(e.target.value);
              setLoginError(false);
            }}
            placeholder="Login"
            className={cn(inputCls, "mt-0 text-center", loginError && "border-terra")}
          />
          <input
            type="password"
            value={pwd}
            onChange={(e) => {
              setPwd(e.target.value);
              setPwdError(false);
            }}
            placeholder="Parol"
            className={cn(inputCls, "mt-0 text-center", pwdError && "border-terra")}
          />
          {loginError && <p className="text-xs font-bold text-terra">Login noto'g'ri, qayta urinib ko'ring.</p>}
          {pwdError && <p className="text-xs font-bold text-terra">Parol noto'g'ri, qayta urinib ko'ring.</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-leaf py-3.5 text-sm font-extrabold tracking-wide text-cream uppercase transition-all hover:-translate-y-0.5 hover:bg-terra"
          >
            Kirish
          </button>
        </form>
        <button
          onClick={() => nav({ name: "home" })}
          className="mt-6 text-xs font-bold text-ink-soft transition-colors hover:text-terra"
        >
          ← Bosh sahifaga qaytish
        </button>
      </div>
    );
  }

  /* ================= ADMIN PANEL ================= */
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:py-14">
      <nav className="mb-6 flex items-center gap-2 text-xs font-bold tracking-wide text-ink-soft/70">
        <button onClick={() => nav({ name: "home" })} className="transition-colors hover:text-terra">
          Bosh sahifa
        </button>
        <span>/</span>
        <span className="text-ink">Admin panel</span>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Overline className="text-terra">Boshqaruv paneli</Overline>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Guldastalarni <em className="text-terra italic">boshqarish</em>
          </h1>
        </div>
        <button
          onClick={() => {
            sessionStorage.removeItem(AUTH_KEY);
            setUnlocked(false);
          }}
          className="text-xs font-extrabold tracking-[0.2em] text-ink-soft uppercase hover:text-terra"
        >
          Chiqish
        </button>
      </div>

      <p className="mt-3 max-w-2xl text-sm text-ink-soft">
        Bu yerda qilingan o'zgarishlar shu brauzerda saqlanadi (localStorage) — sahifani yopib
        qayta ochsangiz ham turadi.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[420px_1fr]">
        {/* ============ FORM ============ */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-sand bg-linen p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">
                {editingId != null ? "Guldastani tahrirlash" : "Yangi guldasta qo'shish"}
              </h2>
              {editingId != null && (
                <button
                  onClick={startNew}
                  className="flex items-center gap-1 text-xs font-extrabold text-ink-soft uppercase hover:text-terra"
                >
                  <IconX className="h-3.5 w-3.5" /> Bekor qilish
                </button>
              )}
            </div>

            <form onSubmit={submit} className="mt-5 space-y-4">
              <div>
                <label className={labelCls}>Nomi</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Masalan: Bahor qaytardi"
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Kategoriya</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as CategoryKey })}
                    className={cn(inputCls, "cursor-pointer")}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Belgi</label>
                  <select
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value as Tag | "none" })}
                    className={cn(inputCls, "cursor-pointer")}
                  >
                    <option value="none">Yo'q</option>
                    {(Object.keys(TAG_LABEL) as Tag[]).map((t) => (
                      <option key={t} value={t}>
                        {TAG_LABEL[t]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Narxi (so'm)</label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="450000"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Eski narx (ixtiyoriy)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.oldPrice}
                    onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
                    placeholder="chegirma bo'lsa"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Reyting</label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Baholar soni</label>
                  <input
                    type="number"
                    min={0}
                    value={form.reviews}
                    onChange={(e) => setForm({ ...form, reviews: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Ombordagi soni</label>
                  <input
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Rasm URL manzili</label>
                <input
                  required
                  value={form.img}
                  onChange={(e) => setForm({ ...form, img: e.target.value })}
                  placeholder="https://images.pexels.com/…"
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Ranglar</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {COLORS.map((c) => {
                    const active = form.colors.includes(c.key);
                    return (
                      <button
                        type="button"
                        key={c.key}
                        onClick={() => toggleColor(c.key)}
                        title={c.label}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full border py-1.5 pr-3 pl-1.5 text-xs font-bold transition-all",
                          active
                            ? "border-leaf bg-leaf text-cream"
                            : "border-ink/15 bg-cream hover:border-leaf/50"
                        )}
                      >
                        <span className="h-3.5 w-3.5 rounded-full border border-ink/15" style={{ background: c.hex }} />
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className={labelCls}>Qisqa tavsif</label>
                <textarea
                  required
                  rows={2}
                  value={form.short}
                  onChange={(e) => setForm({ ...form, short: e.target.value })}
                  placeholder="Katalog kartochkasida ko'rinadigan qisqa matn"
                  className={cn(inputCls, "resize-none")}
                />
              </div>

              <div>
                <label className={labelCls}>To'liq tavsif</label>
                <textarea
                  required
                  rows={3}
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  placeholder="Mahsulot sahifasida ko'rinadigan to'liq matn"
                  className={cn(inputCls, "resize-none")}
                />
              </div>

              <div>
                <label className={labelCls}>Tarkibi (har bir qator — alohida band)</label>
                <textarea
                  rows={4}
                  value={form.composition}
                  onChange={(e) => setForm({ ...form, composition: e.target.value })}
                  placeholder={"15 dona qizil rustar\nEukaliptus barglari\nKraft qog'ozi o'rami"}
                  className={cn(inputCls, "resize-none font-mono text-xs")}
                />
              </div>

              <button
                type="submit"
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-extrabold tracking-wide uppercase transition-all",
                  saved ? "bg-leaf text-cream" : "bg-terra text-cream hover:-translate-y-0.5 hover:bg-leaf"
                )}
              >
                {saved ? (
                  <>
                    <IconCheck className="h-4 w-4" /> Saqlandi!
                  </>
                ) : editingId != null ? (
                  <>
                    <IconEdit className="h-4 w-4" /> O'zgarishlarni saqlash
                  </>
                ) : (
                  <>
                    <IconPlus className="h-4 w-4" /> Guldastani qo'shish
                  </>
                )}
              </button>
            </form>
          </div>

          <button
            onClick={() => {
              if (confirm("Barcha o'zgarishlar bekor qilinib, asl katalog tiklansinmi?")) {
                resetProducts();
                startNew();
              }
            }}
            className="mt-4 w-full rounded-full border border-ink/15 py-3 text-xs font-extrabold tracking-[0.2em] text-ink-soft uppercase transition-colors hover:border-terra hover:text-terra"
          >
            Asl katalogni tiklash
          </button>
        </div>

        {/* ============ PRODUCT LIST ============ */}
        <div>
          <p className="mb-4 text-sm text-ink-soft">
            <span className="font-extrabold text-ink">{products.length}</span> ta guldasta katalogda
          </p>
          <div className="space-y-3">
            {sortedProducts.map((p) => (
              <div
                key={p.id}
                className={cn(
                  "flex items-center gap-4 rounded-2xl border bg-linen p-3.5 transition-colors",
                  editingId === p.id ? "border-terra" : "border-sand"
                )}
              >
                <img src={p.img} alt={p.name} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg font-semibold">{p.name}</p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    {CATEGORIES.find((c) => c.key === p.category)?.label} · {formatPrice(p.price)} ·{" "}
                    {p.stock} ta omborda
                  </p>
                </div>
                {confirmDeleteId === p.id ? (
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => doDelete(p.id)}
                      className="rounded-full bg-terra px-3 py-2 text-[11px] font-extrabold text-cream uppercase"
                    >
                      O'chirish
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="rounded-full border border-ink/15 px-3 py-2 text-[11px] font-extrabold uppercase"
                    >
                      Yo'q
                    </button>
                  </div>
                ) : (
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      aria-label="Tahrirlash"
                      className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 bg-cream text-ink transition-colors hover:border-terra hover:text-terra"
                    >
                      <IconEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(p.id)}
                      aria-label="O'chirish"
                      className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 bg-cream text-ink transition-colors hover:border-terra hover:text-terra"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {products.length === 0 && (
              <div className="grid place-items-center rounded-2xl border border-dashed border-ink/20 bg-linen/60 px-6 py-16 text-center">
                <IconFlower className="h-12 w-12 text-sand" />
                <p className="mt-4 text-sm text-ink-soft">Hozircha guldastalar yo'q. Birinchisini qo'shing!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
import { useSyncExternalStore } from "react";
import {
  CATEGORIES,
  COLORS,
  PRODUCTS as SEED_PRODUCTS,
  type CategoryKey,
  type ColorKey,
  type Product,
  type Tag,
} from "./Products";
import { cloudConfigured, cloudPull, cloudPush } from "./cloud";

// ─── Konstantalar ────────────────────────────────────────────────────────────

const STORAGE_KEY = "gullar-products";
const SEED_SIGNATURE = JSON.stringify(SEED_PRODUCTS);

/** Admin panelidagi bulut statusi */
export type CloudStatus = "unconfigured" | "syncing" | "synced" | "error";

const CATEGORY_KEYS = new Set<string>(CATEGORIES.map((c) => c.key));
const COLOR_KEYS = new Set<string>(COLORS.map((c) => c.key));
const TAG_KEYS = new Set<Tag>(["hit", "new", "sale"]);

// ─── Ma'lumotlarni tekshirish / normallashtirish ─────────────────────────────
// Bulut yoki localStorage'dan kelgan JSON tuzilishi kafolatlanmaydi.
// Har bir yozuv qat'iy tekshiriladi va yetishmagan maydonlar standart
// qiymat bilan to'ldiriladi — aks holda UI render paytida uchib ketadi.

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function asNumber(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((v): v is string => typeof v === "string")
    : [];
}

function normalizeProduct(raw: unknown, fallbackId: number): Product | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;

  const name = asString(p.name);
  const img = asString(p.img);
  if (!name || !img) return null; // rendersiz maydonlar — yozuvni tashlab ketamiz

  const colors = Array.isArray(p.colors)
    ? p.colors.filter(
        (c): c is ColorKey => typeof c === "string" && COLOR_KEYS.has(c)
      )
    : [];

  return {
    id: asNumber(p.id, fallbackId),
    name,
    category: CATEGORY_KEYS.has(p.category as string)
      ? (p.category as CategoryKey)
      : "buketlar",
    price: asNumber(p.price, 0),
    ...(p.oldPrice == null ? {} : { oldPrice: asNumber(p.oldPrice, 0) }),
    rating: asNumber(p.rating, 0),
    reviews: asNumber(p.reviews, 0),
    colors: colors.length > 0 ? colors : (["oq"] as ColorKey[]),
    ...(TAG_KEYS.has(p.tag as Tag) ? { tag: p.tag as Tag } : {}),
    img,
    short: asString(p.short, name),
    desc: asString(p.desc, name),
    composition: asStringArray(p.composition),
    stock: Math.max(0, asNumber(p.stock, 0)),
  };
}

function normalizeProducts(raw: unknown): Product[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const next: Product[] = [];
  raw.forEach((item, i) => {
    const p = normalizeProduct(item, i + 1);
    if (p) next.push(p);
  });
  return next.length > 0 ? next : null;
}

function readLocal(): Product[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;

    // Eski seed katalogi bo'lsa, yangi bulut/seed ma'lumotlari ustun kelishi uchun e'tiborsiz qoldiramiz
    if (JSON.stringify(parsed) === SEED_SIGNATURE) return null;

    return normalizeProducts(parsed);
  } catch {
    return null; // localStorage o'chiq yoki JSON buzilgan — seed'ga qaytamiz
  }
}

// ─── Tashqi store yadrosi (useSyncExternalStore uchun) ───────────────────────

// Boshlang'ich holat
let products: Product[] = readLocal() ?? SEED_PRODUCTS;
let cloudStatus: CloudStatus = cloudConfigured() ? "syncing" : "unconfigured";
let userEdited = false;
let booted = false;

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// MUHIM (referential integrity): getSnapshot har doim modul darajasidagi
// `products` havolasini qaytaradi. Massiv faqat `applyProducts` ichida YANGI
// havola bilan almashtiriladi va hech qachon o'sha joyida mutatsiya qilinmaydi.
// Snapshot getter hech qachon hisoblangan qiymat (filter/map/spread) qaytarmaydi
// — aks holda useSyncExternalStore har renderda boshqacha havola ko'rib,
// cheksiz qayta render (infinite loop) qiladi.
function getSnapshot(): Product[] {
  return products;
}

function getServerSnapshot(): Product[] {
  return products; // SSR/hidratsiya uchun bir xil havola
}

function getCloudStatusSnapshot(): CloudStatus {
  return cloudStatus; // string primitive — doim barqaror
}

function setCloudStatus(next: CloudStatus) {
  if (cloudStatus === next) return; // o'zgarish yo'q → emit ham yo'q
  cloudStatus = next;
  emit();
}

function persistLocal() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    /* localStorage o'chiq (private mode) bo'lsa e'tiborsiz qoldiramiz */
  }
}

function applyProducts(next: Product[]) {
  products = next; // yangi havola → barcha obunachilarga bitta re-render
  persistLocal();
  emit();
}

/** Bulutga yozadi va statusni yakuniy holatga o'tkazadi ("synced"/"error"). */
async function syncToCloud(): Promise<void> {
  if (!cloudConfigured()) return;
  setCloudStatus("syncing");
  // Bin tuzilishi hujjatdagiga mos: { products: [...] }
  const ok = await cloudPush({ products });
  setCloudStatus(ok ? "synced" : "error");
}

// ─── React hook'lari ─────────────────────────────────────────────────────────

/** Mahsulotlar ro'yxatini reaktiv o'qish xuki */
export function useProducts(): Product[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Bulut statusini reaktiv o'qish xuki */
export function useCloudStatus(): CloudStatus {
  return useSyncExternalStore(subscribe, getCloudStatusSnapshot, getCloudStatusSnapshot);
}

/** React-dan tashqarida ishlatish uchun no-reaktiv funksiya */
export function getProducts(): Product[] {
  return products;
}

// ─── Katalog mutatsiyalari ───────────────────────────────────────────────────

function nextId(): number {
  return products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
}

export function addProduct(data: Omit<Product, "id">): Product {
  const product: Product = { ...data, id: nextId() };
  userEdited = true;
  applyProducts([product, ...products]);
  void syncToCloud();
  return product;
}

export function updateProduct(id: number, data: Omit<Product, "id">): void {
  userEdited = true;
  applyProducts(products.map((p) => (p.id === id ? { ...data, id } : p)));
  void syncToCloud();
}

export function removeProduct(id: number): void {
  userEdited = true;
  applyProducts(products.filter((p) => p.id !== id));
  void syncToCloud();
}

/** Barcha o'zgarishlarni tozalab, boshlang'ich katalogga qaytaradi */
export function resetProducts(): void {
  userEdited = true;
  applyProducts([...SEED_PRODUCTS]); // yangi havola — seed originali buzmagan holda qoladi
  void syncToCloud();
}

// ─── Bulut sinxronizatsiyasi ─────────────────────────────────────────────────

/** Bulut javobidan katalogni ajratib oladi. JSONBin `record` konvertini ham tanidi. */
function extractProducts(data: unknown): Product[] | null {
  if (!data) return null;

  if (Array.isArray(data)) return normalizeProducts(data);

  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;
    // JSONBin v3 ba'zan { record: <mazmun>, metadata } konvertini qaytaradi
    if (obj.record !== undefined) return extractProducts(obj.record);
    if (Array.isArray(obj.products)) return normalizeProducts(obj.products);
  }
  return null;
}

/**
 * Dastur ishga tushganda bulut bilan bir martalik sinxronizatsiya.
 * Kafolatlar:
 *  • faqat bir marta ishlaydi (StrictMode'dagi ikki karra effect'ga chidamli);
 *  • istalgan xatoda "syncing" holatida osilib qolmaydi — yakunda doim
 *    "synced" yoki "error" holatiga o'tadi;
 *  • bulut ishlamasa yoki noto'g'ri JSON kelsa, lokaldagi (yoki seed)
 *    katalog bilan sayt ishlashda davom etadi.
 */
export async function initCloudSync(): Promise<void> {
  if (booted) return;

  if (!cloudConfigured()) {
    setCloudStatus("unconfigured");
    return;
  }
  booted = true;

  try {
    const res = await cloudPull();

    // 1) Tarmoq/config xatosi → lokaldagi katalog bilan davom etamiz
    if (!res.ok) {
      if (products.length === 0) applyProducts(SEED_PRODUCTS);
      setCloudStatus("error");
      return;
    }

    // 2) Foydalanuvchi bulutdan oldin tahrir qilgan bo'lsa, bulut ustun kelmaydi
    if (userEdited) {
      setCloudStatus("synced");
      return;
    }

    // 3) Bulutdan katalog muvaffaqiyatli o'qildi
    const extracted = extractProducts(res.data);
    if (extracted) {
      applyProducts(extracted);
      setCloudStatus("synced");
      return;
    }

    // 4) Bulut bo'sh yoki tuzilishi taniqsiz → mavjud katalogni yuklaymiz
    if (products.length === 0) applyProducts(SEED_PRODUCTS);
    await syncToCloud();
  } catch (err) {
    // Kafolat: hech qachon "syncing" holatida qolib ketmaymiz
    console.warn("[Store] initCloudSync xato — lokal katalog ishlatiladi:", err);
    if (products.length === 0) applyProducts(SEED_PRODUCTS);
    setCloudStatus("error");
  }
}
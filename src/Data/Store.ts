import { useSyncExternalStore } from "react";
import { PRODUCTS as SEED_PRODUCTS, type Product } from "./Products";
import { cloudConfigured, cloudPull, cloudPush } from "./cloud";

const STORAGE_KEY = "gullar-products";
const SEED_SIGNATURE = JSON.stringify(SEED_PRODUCTS);

/** Admin panelidagi bulut statusi */
export type CloudStatus = "unconfigured" | "syncing" | "synced" | "error";

function readLocal(): Product[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) return null;

    // Eski seed katalogi bo'lsa, yangi bulut/seed ma'lumotlari ustun kelishi uchun e'tiborsiz qoldiramiz
    if (JSON.stringify(parsed) === SEED_SIGNATURE) return null;

    return parsed as Product[];
  } catch {
    return null;
  }
}

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

function getSnapshot(): Product[] {
  return products;
}

function getCloudStatusSnapshot(): CloudStatus {
  return cloudStatus;
}

function setCloudStatus(next: CloudStatus) {
  if (cloudStatus === next) return;
  cloudStatus = next;
  emit();
}

function persistLocal() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    /* localStorage o'chiq bo'lsa e'tiborsiz qoldiramiz */
  }
}

function applyProducts(next: Product[]) {
  products = next;
  persistLocal();
  emit();
}

function syncToCloud() {
  if (!cloudConfigured()) return;
  setCloudStatus("syncing");
  void cloudPush(products).then((ok) => setCloudStatus(ok ? "synced" : "error"));
}

/** Mahsulotlar ro'yxatini reaktiv o'qish xuki */
export function useProducts(): Product[] {
  return useSyncExternalStore(subscribe, getSnapshot);
}

/** Bulut statusini reaktiv o'qish xuki */
export function useCloudStatus(): CloudStatus {
  return useSyncExternalStore(subscribe, getCloudStatusSnapshot);
}

/** React-dan tashqarida ishlatish uchun no-reaktiv funksiya */
export function getProducts(): Product[] {
  return products;
}

function nextId(): number {
  return products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
}

export function addProduct(data: Omit<Product, "id">): Product {
  const product: Product = { ...data, id: nextId() };
  userEdited = true;
  applyProducts([product, ...products]);
  syncToCloud();
  return product;
}

export function updateProduct(id: number, data: Omit<Product, "id">): void {
  userEdited = true;
  applyProducts(products.map((p) => (p.id === id ? { ...data, id } : p)));
  syncToCloud();
}

export function removeProduct(id: number): void {
  userEdited = true;
  applyProducts(products.filter((p) => p.id !== id));
  syncToCloud();
}

/** Barcha o'zgarishlarni tozalab, boshlang'ich katalogga qaytaradi */
export function resetProducts(): void {
  userEdited = true;
  applyProducts(SEED_PRODUCTS);
  syncToCloud();
}

function allLookLikeProducts(arr: unknown[]): boolean {
  return arr.every(
    (p) => p && typeof p === "object" && "id" in p && "name" in p && "img" in p
  );
}

function extractProducts(data: unknown): Product[] | null {
  if (!data) return null;

  if (Array.isArray(data)) {
    if (!data.length) return null;
    return allLookLikeProducts(data) ? (data as Product[]) : null;
  }
  if (typeof data === "object") {
    const wrapped = (data as { products?: unknown }).products;
    if (Array.isArray(wrapped) && allLookLikeProducts(wrapped)) {
      return wrapped as Product[];
    }
  }
  return null;
}

/**
 * Dastur ishga tushganda bulut bilan bir martalik sinxronizatsiya
 */
export async function initCloudSync(): Promise<void> {
  if (booted || !cloudConfigured()) return;
  booted = true;

  try {
    const res = await cloudPull();
    if (!res.ok) {
      setCloudStatus("error");
      return;
    }
    if (userEdited) {
      setCloudStatus("synced");
      return;
    }
    const extracted = extractProducts(res.data);
    if (extracted) {
      applyProducts(extracted);
      setCloudStatus("synced");
    } else {
      // Bulut bo'sh bo'lsa, mavjud mahsulotlarni yuboramiz
      if (products.length === 0) {
        applyProducts(SEED_PRODUCTS);
      }
      syncToCloud();
    }
  } catch {
    setCloudStatus("error");
  }
}
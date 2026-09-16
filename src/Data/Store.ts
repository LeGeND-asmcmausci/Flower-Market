import { useSyncExternalStore } from "react";
import { PRODUCTS as SEED_PRODUCTS, type Product } from "./Products";
import { cloudConfigured, cloudPull, cloudPush } from "./cloud";

const STORAGE_KEY = "gullar-products";
const SEED_SIGNATURE = JSON.stringify(SEED_PRODUCTS);

/** Where the catalog currently stands, shown as a chip in the admin panel. */
export type CloudStatus = "unconfigured" | "syncing" | "synced" | "error";

function readLocal(): Product[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    // Old sessions stored the untouched seed catalog — ignore it so the cloud
    // copy (or the fresh seed below) wins instead of a stale local snapshot.
    if (JSON.stringify(parsed) === SEED_SIGNATURE) return null;
    return parsed as Product[];
  } catch {
    return null;
  }
}

let products: Product[] = readLocal() ?? SEED_PRODUCTS;
let cloudStatus: CloudStatus = cloudConfigured() ? "syncing" : "unconfigured";
let userEdited = false; // set once the admin changes something after boot
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
    /* ignore, e.g. storage disabled */
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

/** Reactive read of the current product list — re-renders on any admin change. */
export function useProducts(): Product[] {
  return useSyncExternalStore(subscribe, getSnapshot);
}

/** Reactive read of the cloud sync status (admin status chip). */
export function useCloudStatus(): CloudStatus {
  return useSyncExternalStore(subscribe, getCloudStatusSnapshot);
}

/** Non-reactive read, for use outside React (e.g. computing an id). */
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

/** Wipes any edits, restores the original seed catalog and re-syncs it to the cloud. */
export function resetProducts(): void {
  userEdited = true;
  applyProducts(SEED_PRODUCTS);
  syncToCloud();
}

function allLookLikeProducts(arr: unknown[]): boolean {
  return arr.every((p) => p && typeof p === "object" && "id" in p && "name" in p && "img" in p);
}

/**
 * Unwraps the bin content into a product list.
 * - `{ products: [...] }` wrapper (even empty) → authoritative.
 * - Plain non-empty array of products → authoritative (easy manual import).
 * - Non-empty products array or wrapper → authoritative.
 * - Empty/garbage content → null (bin counts as fresh and gets seeded).
 */
function extractProducts(data: unknown): Product[] | null {
  if (!data) return null;

  if (Array.isArray(data)) {
    if (!data.length) return null;
    return allLookLikeProducts(data) ? (data as Product[]) : null;
  }
  if (data && typeof data === "object") {
    const wrapped = (data as { products?: unknown }).products;
    if (Array.isArray(wrapped) && allLookLikeProducts(wrapped)) {
      return wrapped as Product[];

  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const target = obj.record ?? obj;

    if (Array.isArray(target)) {
      if (!target.length) return null;
      return allLookLikeProducts(target) ? (target as Product[]) : null;
    }

    if (target && typeof target === "object") {
      const wrapped = (target as { products?: unknown }).products;
      if (Array.isArray(wrapped)) {
        if (!wrapped.length) return null; // Empty bin -> treat as fresh and seed!
        return allLookLikeProducts(wrapped) ? (wrapped as Product[]) : null;
      }
    }
  }
  return null;
}

/**
 * One-time boot: pull the catalog from the cloud so admin edits are visible to
 * every visitor.
 * - Cloud reachable → its copy wins (unless the admin already changed something).
 * - Fresh/empty bin → current catalog (seed or local edits) is pushed up.
 * - Cloud reachable with flowers → its copy wins.
 * - Fresh/empty bin → SEED_PRODUCTS catalog is pushed up to populate the cloud.
 * - Unreachable → local snapshot keeps the shop working, status = "error".
 */
export async function initCloudSync(): Promise<void> {
  if (booted || !cloudConfigured()) return;
  booted = true;

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
  if (extracted && extracted.length > 0) {
    applyProducts(extracted);
    setCloudStatus("synced");
  } else {
    // Fresh bin — seed it with the current catalog.
    // Fresh or empty bin: populate with all 16 seed flowers and sync to cloud!
    if (products.length === 0) {
      applyProducts(SEED_PRODUCTS);
    }
    syncToCloud();
  }
}

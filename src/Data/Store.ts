import { useSyncExternalStore } from "react";
import { PRODUCTS as SEED_PRODUCTS, type Product } from "./Products";

const STORAGE_KEY = "gullar-products";

function readStorage(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Product[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {
    /* ignore */
  }
  return SEED_PRODUCTS;
}

let products: Product[] = readStorage();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    /* ignore, e.g. storage disabled */
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return products;
}

/** Reactive read of the current product list — re-renders on any admin change. */
export function useProducts(): Product[] {
  return useSyncExternalStore(subscribe, getSnapshot);
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
  products = [product, ...products];
  persist();
  emit();
  return product;
}

export function updateProduct(id: number, data: Omit<Product, "id">): void {
  products = products.map((p) => (p.id === id ? { ...data, id } : p));
  persist();
  emit();
}

export function removeProduct(id: number): void {
  products = products.filter((p) => p.id !== id);
  persist();
  emit();
}

/** Wipes any local edits and restores the original seed catalog. */
export function resetProducts(): void {
  products = SEED_PRODUCTS;
  persist();
  emit();
}
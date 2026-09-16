/**
 * Cloud sync for the product catalog via JSONBin.io (free tier).
 *
 * One-time setup (~3 minutes):
 *   1. Create a free account at https://jsonbin.io → "API Keys" → copy your X-Master-Key.
 *   2. Create a bin (any content) and copy its id from the bin URL.
 *   3. Add two Environment Variables in Vercel (Project → Settings → Environment Variables):
 *        VITE_JSONBIN_KEY = <your X-Master-Key>
 *        VITE_JSONBIN_BIN = <your bin id>
 *      Then redeploy. Locally, put the same keys into my-app/.env.local.
 *
 * The bin stores `{ "products": [...] }`. A fresh/empty bin is seeded with the
 * current catalog on first boot.
 */

type Env = { VITE_JSONBIN_KEY?: string; VITE_JSONBIN_BIN?: string };

const env: Env = (import.meta as unknown as { env?: Env }).env ?? {};

export const CLOUD_CONFIG = {
  key: env.VITE_JSONBIN_KEY ?? "",
  bin: env.VITE_JSONBIN_BIN ?? "",
};

export function cloudConfigured(): boolean {
  return Boolean(CLOUD_CONFIG.key && CLOUD_CONFIG.bin);
}

const binUrl = () => `https://api.jsonbin.io/v3/b/${CLOUD_CONFIG.bin}`;

/**
 * So'rov osilib qolsa (tarmoq uzilishi, proxy muammosi) store "syncing"
 * holatida abadiy qotib qolmasligi uchun har bir fetchga qattiy timeout.
 */
const REQUEST_TIMEOUT_MS = 8000;

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export type CloudRead = { ok: true; data: unknown } | { ok: false };

/** Reads the catalog from the cloud bin. `ok: false` when unconfigured or unreachable. */
export async function cloudPull(): Promise<CloudRead> {
  if (!cloudConfigured()) return { ok: false };
  try {
    const res = await fetchWithTimeout(binUrl(), {
      headers: { "X-Master-Key": CLOUD_CONFIG.key, "X-Bin-Meta": "false" },
    });
    if (!res.ok) return { ok: false };
    const data = (await res.json()) ?? null;
    return { ok: true, data };
  } catch {
    return { ok: false }; // tarmoq xatosi, timeout yoki noto'g'ri JSON
  }
}

/** Overwrites the cloud bin with `data`. Returns true on success. */
export async function cloudPush(data: unknown): Promise<boolean> {
  if (!cloudConfigured()) return false;
  try {
    const res = await fetchWithTimeout(binUrl(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": CLOUD_CONFIG.key,
        "X-Bin-Versioning": "false",
      },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false; // tarmoq xatosi yoki timeout
  }
}

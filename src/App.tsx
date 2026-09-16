import { useCallback, useEffect, useMemo, useState } from "react";
import { type Product } from "./Data/Products";
import { initCloudSync, useProducts } from "./Data/Store";
import type { Page } from "./Utils/types";
import { Header } from "./Components/Header";
import { Footer } from "./Components/Footer";
import { Home } from "./Pages/Home";
import { Catalog } from "./Pages/Catalog";
import { ProductDetail } from "./Pages/ProductDetail";
import { Cart } from "./Pages/Cart";
import { About, Contact, OrderSuccess } from "./Pages/InfoPages";
import { Admin } from "./Pages/Admin";
import { IconCheck } from "./Components/Ui";

type CartMap = Record<number, number>;

/** Checks whether the current URL points to the admin panel.
 * Supports /admin, /admin/, #admin, #/admin, or ?admin across all hostings.
 */
function isAdminRoute(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname.replace(/\/+$/, "").toLowerCase();
  const hash = window.location.hash.toLowerCase().replace(/\/+$/, "");
  const search = window.location.search.toLowerCase();
  return (
    path === "/admin" ||
    path.endsWith("/admin") ||
    hash === "#admin" ||
    hash === "#/admin" ||
    search === "?admin" ||
    search.startsWith("?admin=") ||
    search.includes("page=admin")
  );
}

function loadCart(): CartMap {
  try {
    const raw = localStorage.getItem("gullar-cart");
    if (raw) return JSON.parse(raw) as CartMap;
  } catch {
    /* ignore */
  }
  return {};
}

export default function App() {
  // Initial page comes directly from URL: /admin immediately opens admin
  const [page, setPage] = useState<Page>(() =>
    isAdminRoute() ? { name: "admin" } : { name: "home" }
  );
  const [cart, setCart] = useState<CartMap>(loadCart);
  const [toast, setToast] = useState<string | null>(null);
  const products = useProducts();

  const nav = useCallback((p: Page) => {
    setPage(p);
  }, []);

  // Listen to browser navigation (back/forward and URL changes)
  useEffect(() => {
    const onLocationChange = () => {
      if (isAdminRoute()) {
        setPage((prev) => (prev.name === "admin" ? prev : { name: "admin" }));
      } else {
        setPage((prev) => (prev.name === "admin" ? { name: "home" } : prev));
      }
    };
    window.addEventListener("popstate", onLocationChange);
    window.addEventListener("hashchange", onLocationChange);
    return () => {
      window.removeEventListener("popstate", onLocationChange);
      window.removeEventListener("hashchange", onLocationChange);
    };
  }, []);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem("gullar-cart", JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [page]);

  // Keep the browser URL in sync so /admin is linkable and refresh-safe
  useEffect(() => {
    try {
      const currentIsAdmin = isAdminRoute();
      if (page.name === "admin") {
        if (!currentIsAdmin) {
          window.history.pushState(null, "", "/admin");
        }
        document.title = "Admin panel — GULLAR";
      } else {
        if (currentIsAdmin) {
          window.history.pushState(null, "", "/");
        }
        document.title = "GULLAR — Gullar do'koni | Toshkent";
      }
    } catch {
      /* ignore */
    }
  }, [page.name]);

  // Bulut sinxronizatsiyasi — mount'da aynan bir marta ishga tushadi.
  // initCloudSync() promiseni kutmaydi va modul darajasida `booted` bilan
  // himoyalangan, shuning uchun bu effect qayta render zanjirini boshlamaydi.
  // Bulutdan kelgan yangi ma'lumotlar store'dagi bitta emit() orqali
  // useProducts()/useCloudStatus() obunachilariga yetib boradi.
  useEffect(() => {
    void initCloudSync();
  }, []);

  // Clear cart once an order is placed
  useEffect(() => {
    if (page.name === "success") setCart({});
  }, [page]);

  // Toast auto-hide
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const addToCart = useCallback((p: Product, qty = 1) => {
    setCart((prev) => {
      const next = { ...prev, [p.id]: Math.min(p.stock, (prev[p.id] ?? 0) + qty) };
      return next;
    });
    setToast(`«${p.name}» savatga qo'shildi`);
  }, []);

  const setQty = useCallback(
    (id: number, qty: number) => {
      setCart((prev) => {
        const next = { ...prev };
        if (qty <= 0) delete next[id];
        else next[id] = Math.min(products.find((p) => p.id === id)?.stock ?? 99, qty);
        return next;
      });
    },
    [products]
  );

  const remove = useCallback((id: number) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const clear = useCallback(() => setCart({}), []);

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const product = products.find((p) => p.id === Number(id));
          return product ? { product, qty } : null;
        })
        .filter((item): item is { product: Product; qty: number } => item !== null),
    [cart, products]
  );

  const cartCount = cartItems.reduce((s, it) => s + it.qty, 0);

  const openProduct = useCallback((p: Product) => setPage({ name: "product", id: p.id }), []);

  return (
    <div className="min-h-screen">
      <div className="grain" aria-hidden />
      <Header page={page} nav={nav} cartCount={cartCount} />

      <main>
        {page.name === "home" && <Home nav={nav} onOpen={openProduct} onAdd={addToCart} />}

        {page.name === "catalog" && (
          <Catalog
            key={page.category ?? "all"}
            nav={nav}
            onOpen={openProduct}
            onAdd={addToCart}
            initialCategory={page.category}
          />
        )}

        {page.name === "product" &&
          (() => {
            const product = products.find((p) => p.id === page.id);
            if (!product) return null;
            return (
              <ProductDetail
                key={product.id}
                product={product}
                nav={nav}
                onOpen={openProduct}
                onAdd={addToCart}
              />
            );
          })()}

        {page.name === "cart" && (
          <Cart nav={nav} items={cartItems} setQty={setQty} remove={remove} clear={clear} />
        )}

        {page.name === "about" && <About nav={nav} />}
        {page.name === "contact" && <Contact nav={nav} />}
        {page.name === "success" && <OrderSuccess orderId={page.orderId} nav={nav} />}

        {/* Admin panel — secret route, hidden from normal navigation */}
        {page.name === "admin" && <Admin nav={nav} />}
      </main>

      <Footer nav={nav} />

      {/* Toast */}
      <div
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 transition-all duration-400 ${
          toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-cream shadow-2xl">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-leaf">
            <IconCheck className="h-3.5 w-3.5 text-rose" />
          </span>
          {toast}
        </div>
      </div>
    </div>
  );
}
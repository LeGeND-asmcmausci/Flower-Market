import { useEffect, useState } from "react";
import { cn } from "../Utils/Cn";
import type { Nav, Page } from "../Utils/types";
import { IconBag, IconFlower, IconMenu, IconPhone, IconX } from "./Ui";

const LINKS: { label: string; page: Page; key: string }[] = [
  { label: "Bosh sahifa", page: { name: "home" }, key: "home" },
  { label: "Katalog", page: { name: "catalog", category: "all" }, key: "catalog" },
  { label: "Biz haqimizda", page: { name: "about" }, key: "about" },
  { label: "Aloqa", page: { name: "contact" }, key: "contact" },
];

export function Header({
  page,
  nav,
  cartCount,
}: {
  page: Page;
  nav: Nav;
  cartCount: number;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const activeKey = page.name === "product" ? "catalog" : page.name;

  const go = (p: Page) => {
    setOpen(false);
    nav(p);
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="relative z-40 bg-leaf-deep text-cream">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[11px] font-semibold tracking-wide md:px-8">
          <p className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-pulse-soft rounded-full bg-rose" />
              <span className="h-2 w-2 rounded-full bg-rose" />
            </span>
            <span className="hidden sm:inline">Bugun 500 000 so'mdan yuqori — yetkazish bepul ·</span>
            <span className="hidden md:inline"> shahar ichida 60 daqiqada</span>
          </p>
          <a href="tel:+998712000000" className="flex items-center gap-1.5 text-rose transition hover:text-cream">
            <IconPhone className="h-3.5 w-3.5" />
            +998 71 200-00-00
          </a>
        </div>
      </div>

      {/* Main header */}
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "border-sand bg-cream/90 shadow-[0_8px_30px_-18px_rgba(35,41,27,0.35)] backdrop-blur-md"
            : "border-transparent bg-cream/0"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 md:px-8">
          <button onClick={() => go({ name: "home" })} className="group flex items-center gap-2.5" aria-label="Bosh sahifa">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-leaf text-cream transition-transform duration-500 group-hover:rotate-[30deg]">
              <IconFlower className="h-6 w-6" />
            </span>
            <span className="font-display text-2xl font-semibold tracking-tight">
              GULLAR<span className="text-terra">.</span>
            </span>
          </button>

          <nav className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <button
                key={l.key}
                onClick={() => go(l.page)}
                className={cn(
                  "group relative py-1 text-[13px] font-bold tracking-wide uppercase transition-colors",
                  activeKey === l.key ? "text-terra" : "text-ink/70 hover:text-ink"
                )}
              >
                {l.label}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-[2px] bg-terra transition-all duration-300",
                    activeKey === l.key ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => go({ name: "catalog", category: "all" })}
              className="hidden items-center gap-2 rounded-full bg-leaf px-5 py-2.5 text-[13px] font-bold text-cream transition-all duration-300 hover:-translate-y-0.5 hover:bg-terra md:flex"
            >
              Buyurtma berish
            </button>
            <button
              onClick={() => go({ name: "cart" })}
              aria-label="Savat"
              className={cn(
                "relative grid h-11 w-11 place-items-center rounded-full border transition-all duration-300",
                page.name === "cart"
                  ? "border-terra bg-terra text-cream"
                  : "border-ink/15 bg-linen text-ink hover:border-terra hover:text-terra"
              )}
            >
              <IconBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className="absolute -top-1 -right-1 grid h-5 min-w-5 animate-pop place-items-center rounded-full bg-terra px-1 text-[10px] font-extrabold text-cream"
                >
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setOpen(true)}
              aria-label="Menyu"
              className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 bg-linen lg:hidden"
            >
              <IconMenu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-[80] transition-all duration-300 lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
        <div
          className={cn(
            "absolute top-0 right-0 flex h-full w-[85%] max-w-sm flex-col bg-cream shadow-2xl transition-transform duration-400",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-sand px-6 py-5">
            <span className="font-display text-2xl font-semibold">
              GULLAR<span className="text-terra">.</span>
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Yopish"
              className="grid h-10 w-10 place-items-center rounded-full border border-ink/15"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-4 py-6">
            {LINKS.map((l, i) => (
              <button
                key={l.key}
                onClick={() => go(l.page)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-4 text-left font-display text-2xl font-medium transition-colors",
                  activeKey === l.key ? "bg-leaf text-cream" : "hover:bg-sand/60"
                )}
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                {l.label}
                <span className="text-sm opacity-50">0{i + 1}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto border-t border-sand px-6 py-6 text-sm text-ink-soft">
            <p className="font-bold text-ink">Har kuni 08:00 — 21:00</p>
            <p className="mt-1">Chilonzor-7, Bunyodkor 45</p>
            <a href="tel:+998712000000" className="mt-3 inline-flex items-center gap-2 font-bold text-terra">
              <IconPhone className="h-4 w-4" /> +998 71 200-00-00
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
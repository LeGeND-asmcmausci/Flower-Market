import { useMemo, useState } from "react";
import { cn } from "../Utils/Cn";
import type { Nav } from "../Utils/types";
import { formatPrice, type Product } from "../Data/Products";
import {
  IconArrow,
  IconBag,
  IconCheck,
  IconFlower,
  IconMinus,
  IconPlus,
  IconTrash,
  IconTruck,
  Reveal,
} from "../Components/Ui";

export const FREE_DELIVERY_FROM = 500000;
export const DELIVERY_FEE = 30000;

export function Cart({
  nav,
  items,
  setQty,
  remove,
  clear,
}: {
  nav: Nav;
  items: { product: Product; qty: number }[];
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
}) {
  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.product.price * it.qty, 0),
    [items]
  );
  const discount = applied ? Math.round(subtotal * 0.1) : 0;
  const delivery = subtotal - discount >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  const total = subtotal - discount + delivery;
  const toFree = Math.max(0, FREE_DELIVERY_FROM - (subtotal - discount));
  const progress = Math.min(100, ((subtotal - discount) / FREE_DELIVERY_FROM) * 100);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center md:px-8">
        <Reveal>
          <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-linen text-sand shadow-inner">
            <IconFlower className="h-12 w-12" />
          </span>
          <h1 className="mt-8 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Savatingiz hozircha <em className="text-terra italic">bo'sh</em>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-ink-soft">
            Lekin bu xiralashuvchan holat. Katalogda 16 ta tayyor guldasta kutmoqda — ularning
            birortasi sizni xursand qiladi.
          </p>
          <button
            onClick={() => nav({ name: "catalog", category: "all" })}
            className="group mt-8 inline-flex items-center gap-3 rounded-full bg-leaf px-8 py-4 text-sm font-extrabold tracking-wide text-cream uppercase transition-all duration-300 hover:-translate-y-1 hover:bg-terra"
          >
            Katalogni ko'rish
            <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2.5 text-[11px] font-extrabold tracking-[0.3em] text-terra uppercase">
            <IconBag className="h-4 w-4" /> Savat
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight md:text-6xl">
            Buyurtma <em className="text-terra italic">ro'yxati</em>
          </h1>
        </div>
        <button
          onClick={() => {
            clear();
            setPromo("");
            setApplied(false);
          }}
          className="inline-flex items-center gap-2 text-xs font-extrabold tracking-[0.15em] text-ink-soft uppercase transition-colors hover:text-terra"
        >
          <IconTrash className="h-4 w-4" /> Savatni tozalash
        </button>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Items */}
        <div className="space-y-4">
          {/* Free delivery progress */}
          <Reveal className="rounded-2xl border border-sand bg-linen p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-leaf text-cream">
                <IconTruck className="h-5 w-5" />
              </span>
              <p className="text-sm">
                {toFree === 0 ? (
                  <span className="font-extrabold text-leaf">Tabriklaymiz — yetkazish bepul!</span>
                ) : (
                  <>
                    Bepul yetkazishgacha{" "}
                    <span className="font-extrabold text-terra">{formatPrice(toFree)}</span> qoldi
                  </>
                )}
              </p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-sand">
              <div
                className="h-full rounded-full bg-gradient-to-r from-leaf to-terra transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </Reveal>

          {items.map((it, i) => (
            <Reveal key={it.product.id} delay={i * 60}>
              <div className="group flex gap-4 rounded-2xl border border-sand bg-linen p-4 transition-all duration-300 hover:border-terra/40 sm:gap-5 sm:p-5">
                <button
                  onClick={() => nav({ name: "product", id: it.product.id })}
                  className="block h-24 w-20 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-24"
                >
                  <img
                    src={it.product.img}
                    alt={it.product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.2em] text-sage uppercase">
                        {it.product.category}
                      </p>
                      <button
                        onClick={() => nav({ name: "product", id: it.product.id })}
                        className="mt-0.5 text-left font-display text-lg leading-tight font-semibold transition-colors hover:text-terra sm:text-xl"
                      >
                        {it.product.name}
                      </button>
                      <p className="mt-1 text-xs text-ink-soft">{formatPrice(it.product.price)} / dona</p>
                    </div>
                    <button
                      onClick={() => remove(it.product.id)}
                      aria-label="Olib tashlash"
                      className="grid h-9 w-9 place-items-center rounded-full text-ink-soft/50 transition-all hover:bg-terra/10 hover:text-terra"
                    >
                      <IconTrash className="h-4.5 w-4.5" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-ink/15 bg-cream">
                      <button
                        onClick={() => setQty(it.product.id, it.qty - 1)}
                        aria-label="Kamaytirish"
                        className="grid h-10 w-10 place-items-center rounded-l-full transition-colors hover:bg-sand"
                      >
                        <IconMinus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-extrabold">{it.qty}</span>
                      <button
                        onClick={() => setQty(it.product.id, Math.min(it.product.stock, it.qty + 1))}
                        aria-label="Ko'paytirish"
                        className="grid h-10 w-10 place-items-center rounded-r-full transition-colors hover:bg-sand"
                      >
                        <IconPlus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-display text-xl font-semibold">
                      {formatPrice(it.product.price * it.qty)}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Summary */}
        <Reveal delay={150} className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-sand bg-linen p-7">
            <h2 className="font-display text-2xl font-semibold">Buyurtma jami</h2>

            {/* Promo */}
            <div className="mt-5">
              <label className="text-xs font-extrabold tracking-[0.2em] uppercase">
                Chegirma kodi
              </label>
              {applied ? (
                <p className="mt-2 flex items-center gap-2 rounded-full bg-leaf/10 px-4 py-3 text-sm font-bold text-leaf">
                  <IconCheck className="h-4 w-4" /> GULLAR10 — 10% chegirma qo'llandi
                </p>
              ) : (
                <div className="mt-2 flex gap-2">
                  <input
                    value={promo}
                    onChange={(e) => {
                      setPromo(e.target.value.toUpperCase());
                      setPromoError(false);
                    }}
                    placeholder="Masalan: GULLAR10"
                    className={cn(
                      "w-full flex-1 rounded-full border bg-cream px-4 py-3 text-sm font-bold uppercase tracking-wide placeholder:normal-case placeholder:font-medium placeholder:text-ink-soft/50 focus:outline-none",
                      promoError ? "border-terra" : "border-ink/15 focus:border-terra"
                    )}
                  />
                  <button
                    onClick={() => {
                      if (promo.trim() === "GULLAR10") {
                        setApplied(true);
                        setPromoError(false);
                      } else {
                        setPromoError(true);
                      }
                    }}
                    className="rounded-full bg-ink px-5 py-3 text-xs font-extrabold tracking-wide text-cream uppercase transition-colors hover:bg-terra"
                  >
                    Qo'llash
                  </button>
                </div>
              )}
              {promoError && !applied && (
                <p className="mt-1.5 text-xs font-semibold text-terra">Kod topilmadi. Sinab ko'ring: GULLAR10</p>
              )}
            </div>

            <dl className="mt-6 space-y-3 border-t border-sand pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Mahsulotlar ({items.reduce((s, i) => s + i.qty, 0)} ta)</dt>
                <dd className="font-bold">{formatPrice(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-leaf">
                  <dt>Chegirma (10%)</dt>
                  <dd className="font-bold">−{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink-soft">Yetkazib berish</dt>
                <dd className={cn("font-bold", delivery === 0 && "text-leaf")}>
                  {delivery === 0 ? "Bepul" : formatPrice(delivery)}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex items-baseline justify-between border-t-2 border-dashed border-sand pt-5">
              <span className="text-xs font-extrabold tracking-[0.25em] uppercase">Jami</span>
              <span className="font-display text-3xl font-semibold">{formatPrice(total)}</span>
            </div>

            <button
              onClick={() => nav({ name: "success", orderId: `GL-${Math.floor(1000 + Math.random() * 9000)}` })}
              className="group mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-terra py-4 text-sm font-extrabold tracking-wide text-cream uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-leaf hover:shadow-[0_18px_35px_-15px_rgba(49,71,47,0.6)]"
            >
              Buyurtma berish
              <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="mt-4 text-center text-xs text-ink-soft">
              To'lov kuryerda naqd yoki kartada. 100% xavfsiz.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

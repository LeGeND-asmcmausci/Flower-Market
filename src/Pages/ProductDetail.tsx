import { useMemo, useState } from "react";
import { cn } from "../Utils/Cn";
import type { Nav } from "../Utils/types";
import {
  TAG_LABEL,
  categoryLabel,
  colorInfo,
  formatPrice,
  type Product,
} from "../Data/Products";
import { useProducts } from "../Data/Store";
import { ProductCard } from "../Components/ProductCard";
import {
  IconArrow,
  IconBag,
  IconCheck,
  IconClock,
  IconFlower,
  IconMinus,
  IconPlus,
  IconRibbon,
  IconTruck,
  Reveal,
  Stars,
} from "../Components/Ui";

export function ProductDetail({
  product,
  nav,
  onOpen,
  onAdd,
}: {
  product: Product;
  nav: Nav;
  onOpen: (p: Product) => void;
  onAdd: (p: Product, qty?: number) => void;
}) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const products = useProducts();

  const related = useMemo(
    () =>
      products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4),
    [products, product]
  );

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  const add = () => {
    onAdd(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:py-14">
      {/* Breadcrumb */}
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs font-bold tracking-wide text-ink-soft/70">
        <button onClick={() => nav({ name: "home" })} className="transition-colors hover:text-terra">
          Bosh sahifa
        </button>
        <span>/</span>
        <button
          onClick={() => nav({ name: "catalog", category: "all" })}
          className="transition-colors hover:text-terra"
        >
          Katalog
        </button>
        <span>/</span>
        <button
          onClick={() => nav({ name: "catalog", category: product.category })}
          className="transition-colors hover:text-terra"
        >
          {categoryLabel(product.category)}
        </button>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <Reveal className="relative">
          <div className="relative overflow-hidden rounded-[2rem] rounded-t-[999px] border-8 border-linen shadow-[0_40px_70px_-35px_rgba(35,41,27,0.5)]">
            <img
              src={product.img}
              alt={product.name}
              className="aspect-[4/5] w-full object-cover transition-transform duration-[1.8s] ease-out hover:scale-105"
            />
            <div className="absolute top-5 left-5 flex flex-col gap-1.5">
              {product.tag && (
                <span
                  className={cn(
                    "w-fit rounded-full px-3.5 py-1.5 text-[10px] font-extrabold tracking-[0.15em] uppercase",
                    product.tag === "sale"
                      ? "bg-terra text-cream"
                      : product.tag === "new"
                        ? "bg-leaf text-cream"
                        : "bg-gold text-cream"
                  )}
                >
                  {TAG_LABEL[product.tag]}
                </span>
              )}
              {discount > 0 && (
                <span className="w-fit rounded-full bg-ink/80 px-3.5 py-1.5 text-[10px] font-extrabold tracking-[0.15em] text-cream uppercase">
                  −{discount}% chegirma
                </span>
              )}
            </div>
          </div>
          <div className="absolute -bottom-5 right-6 flex items-center gap-2 rounded-full bg-leaf px-5 py-3 text-xs font-extrabold tracking-wide text-cream uppercase shadow-lg">
            <IconCheck className="h-4 w-4 text-rose" /> Sotuvchida bor · {product.stock} ta
          </div>
        </Reveal>

        {/* Info */}
        <Reveal delay={120} className="flex flex-col">
          <p className="text-[11px] font-extrabold tracking-[0.3em] text-terra uppercase">
            {categoryLabel(product.category)}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
            {product.name}
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm">
            <Stars rating={product.rating} />
            <span className="font-bold">{product.rating.toFixed(1)}</span>
            <span className="text-ink-soft">· {product.reviews} ta baho</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-4xl font-semibold">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-lg text-ink-soft/60 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-ink-soft">{product.desc}</p>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-xs font-extrabold tracking-[0.2em] uppercase">Ranglar:</span>
            <div className="flex gap-1.5">
              {product.colors.map((c) => (
                <span
                  key={c}
                  title={colorInfo(c).label}
                  className="h-5 w-5 rounded-full border border-ink/15 transition-transform hover:scale-110"
                  style={{ background: colorInfo(c).hex }}
                />
              ))}
            </div>
            <span className="text-xs text-ink-soft">
              {product.colors.map((c) => colorInfo(c).label).join(", ")}
            </span>
          </div>

          {/* Qty + CTA */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-ink/15 bg-linen">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Kamaytirish"
                className="grid h-14 w-14 place-items-center rounded-l-full transition-colors hover:bg-sand"
              >
                <IconMinus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-display text-2xl font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                aria-label="Ko'paytirish"
                className="grid h-14 w-14 place-items-center rounded-r-full transition-colors hover:bg-sand"
              >
                <IconPlus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={add}
              className={cn(
                "group inline-flex flex-1 items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-extrabold tracking-wide uppercase transition-all duration-300 sm:flex-none",
                added
                  ? "bg-leaf text-cream"
                  : "bg-terra text-cream hover:-translate-y-0.5 hover:bg-leaf hover:shadow-[0_18px_35px_-15px_rgba(49,71,47,0.6)]"
              )}
            >
              {added ? (
                <>
                  <IconCheck className="h-5 w-5" /> Savatga qo'shildi!
                </>
              ) : (
                <>
                  <IconBag className="h-5 w-5 transition-transform group-hover:-rotate-12" />
                  Savatga qo'shish
                </>
              )}
            </button>
          </div>

          {/* Meta */}
          <ul className="mt-8 grid gap-3 rounded-2xl border border-sand bg-linen p-6 sm:grid-cols-3">
            {[
              { icon: IconTruck, t: "Bugun yetkazamiz", d: "18:00 gacha buyurtma" },
              { icon: IconClock, t: "3 kun saqlanadi", d: "yoki almashtiramiz" },
              { icon: IconRibbon, t: "Rasmli qadoq", d: "+ qo'lda kartochka" },
            ].map((m) => (
              <li key={m.t} className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream text-terra">
                  <m.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-extrabold">{m.t}</p>
                  <p className="text-xs text-ink-soft">{m.d}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Composition */}
          <div className="mt-8">
            <h2 className="flex items-center gap-2 text-xs font-extrabold tracking-[0.25em] uppercase">
              <IconFlower className="h-4 w-4 text-terra" /> Tarkibi
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {product.composition.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              O'xshash <em className="text-terra italic">guldastalar</em>
            </h2>
            <button
              onClick={() => nav({ name: "catalog", category: product.category })}
              className="group inline-flex items-center gap-2 text-sm font-extrabold tracking-wide uppercase transition-colors hover:text-terra"
            >
              {categoryLabel(product.category)} bo'limi
              <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <ProductCard product={p} onOpen={onOpen} onAdd={(pp) => onAdd(pp)} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

import { useMemo, useState } from "react";
import { cn } from "../Utils/Cn";
import type { Nav } from "../Utils/types";
import {
  CATEGORIES,
  COLORS,
  PRODUCTS,
  formatPrice,
  type CategoryKey,
  type ColorKey,
  type Product,
} from "../Data/Products";
import { ProductCard } from "../Components/ProductCard";
import { IconFlower, IconSearch, IconX, Reveal } from "../Components/Ui";

const MIN_PRICE = 250000;
const MAX_PRICE = 700000;

type SortKey = "popular" | "new" | "cheap" | "expensive" | "discount";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Ommabop" },
  { key: "new", label: "Yangi kelgan" },
  { key: "cheap", label: "Narxi: arzon → qimmat" },
  { key: "expensive", label: "Narxi: qimmat → arzon" },
  { key: "discount", label: "Chegirmali" },
];

export function Catalog({
  nav,
  onOpen,
  onAdd,
  initialCategory,
}: {
  nav: Nav;
  onOpen: (p: Product) => void;
  onAdd: (p: Product) => void;
  initialCategory?: CategoryKey | "all";
}) {
  const [category, setCategory] = useState<CategoryKey | "all">(initialCategory ?? "all");
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [colors, setColors] = useState<ColorKey[]>([]);
  const [sort, setSort] = useState<SortKey>("popular");
  const [showFilters, setShowFilters] = useState(false);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: PRODUCTS.length };
    CATEGORIES.forEach((c) => (map[c.key] = PRODUCTS.filter((p) => p.category === c.key).length));
    return map;
  }, []);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => p.price <= maxPrice);
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (colors.length) list = list.filter((p) => p.colors.some((c) => colors.includes(c)));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => (p.name + " " + p.short).toLowerCase().includes(q));
    }
    const arr = [...list];
    switch (sort) {
      case "cheap":
        arr.sort((a, b) => a.price - b.price);
        break;
      case "expensive":
        arr.sort((a, b) => b.price - a.price);
        break;
      case "new":
        arr.sort((a, b) => (b.tag === "new" ? 1 : 0) - (a.tag === "new" ? 1 : 0));
        break;
      case "discount":
        arr.sort(
          (a, b) =>
            (b.oldPrice ? 1 - b.price / b.oldPrice : 0) - (a.oldPrice ? 1 - a.price / a.oldPrice : 0)
        );
        break;
      default:
        arr.sort((a, b) => b.reviews - a.reviews);
    }
    return arr;
  }, [category, query, maxPrice, colors, sort]);

  const activeCount =
    (category !== "all" ? 1 : 0) + (maxPrice < MAX_PRICE ? 1 : 0) + colors.length + (query ? 1 : 0);

  const reset = () => {
    setCategory("all");
    setQuery("");
    setMaxPrice(MAX_PRICE);
    setColors([]);
    setSort("popular");
  };

  const toggleColor = (c: ColorKey) =>
    setColors((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 lg:py-16">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-bold tracking-wide text-ink-soft/70">
        <button onClick={() => nav({ name: "home" })} className="transition-colors hover:text-terra">
          Bosh sahifa
        </button>
        <span>/</span>
        <span className="text-ink">Katalog</span>
      </nav>
      {/* Page head */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="flex items-center gap-2.5 text-[11px] font-extrabold tracking-[0.3em] text-terra uppercase">
            <IconFlower className="h-4 w-4" /> Katalog
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight md:text-6xl">
            Barcha <em className="text-terra italic">guldastalar</em>
          </h1>
        </div>
        <p className="text-sm text-ink-soft">
          {filtered.length} ta guldasta topildi · har kuni 150+ yangi gul
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[290px_1fr]">
        {/* ============ FILTERS ============ */}
        <aside>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex w-full items-center justify-between rounded-xl border border-ink/15 bg-linen px-5 py-3.5 text-sm font-extrabold uppercase tracking-wide lg:hidden"
          >
            Filtrlar {activeCount > 0 && <span className="text-terra">({activeCount})</span>}
            <span className={cn("transition-transform duration-300", showFilters && "rotate-45")}>
              <IconX className="h-4 w-4" />
            </span>
          </button>

          <div
            className={cn(
              "mt-4 space-y-7 rounded-2xl border border-sand bg-linen p-6 lg:sticky lg:top-28 lg:mt-0",
              showFilters ? "block" : "hidden lg:block"
            )}
          >
            {/* Search */}
            <div>
              <label className="text-xs font-extrabold tracking-[0.2em] uppercase">Topish</label>
              <div className="relative mt-3">
                <IconSearch className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-soft/60" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Guldasta qidiring…"
                  className="w-full rounded-full border border-ink/15 bg-cream py-3 pr-4 pl-11 text-sm placeholder:text-ink-soft/50 focus:border-terra focus:outline-none"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-extrabold tracking-[0.2em] uppercase">Kategoriya</label>
              <ul className="mt-3 space-y-1">
                {(["all", ...CATEGORIES.map((c) => c.key)] as (CategoryKey | "all")[]).map((key) => {
                  const label = key === "all" ? "Barchasi" : CATEGORIES.find((c) => c.key === key)!.label;
                  const active = category === key;
                  return (
                    <li key={key}>
                      <button
                        onClick={() => setCategory(key)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                          active
                            ? "bg-leaf text-cream shadow-sm"
                            : "text-ink/70 hover:bg-sand/60 hover:text-ink"
                        )}
                      >
                        {label}
                        <span
                          className={cn(
                            "grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] font-extrabold",
                            active ? "bg-cream/20" : "bg-sand"
                          )}
                        >
                          {counts[key]}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold tracking-[0.2em] uppercase">Narx</label>
                <span className="text-sm font-extrabold text-terra">{formatPrice(maxPrice)} gacha</span>
              </div>
              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={10000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-4 w-full"
                aria-label="Maksimal narx"
              />
              <div className="mt-1 flex justify-between text-[11px] font-semibold text-ink-soft/60">
                <span>{formatPrice(MIN_PRICE)}</span>
                <span>{formatPrice(MAX_PRICE)}</span>
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="text-xs font-extrabold tracking-[0.2em] uppercase">Rang</label>
              <div className="mt-3 flex flex-wrap gap-2">
                {COLORS.map((c) => {
                  const active = colors.includes(c.key);
                  return (
                    <button
                      key={c.key}
                      onClick={() => toggleColor(c.key)}
                      title={c.label}
                      className={cn(
                        "flex items-center gap-2 rounded-full border py-1.5 pr-3 pl-1.5 text-xs font-bold transition-all duration-200",
                        active
                          ? "border-leaf bg-leaf text-cream"
                          : "border-ink/15 bg-cream hover:border-leaf/50"
                      )}
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-ink/15"
                        style={{ background: c.hex }}
                      />
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {activeCount > 0 && (
              <button
                onClick={reset}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-terra/40 py-3 text-xs font-extrabold tracking-[0.2em] text-terra uppercase transition-all hover:bg-terra hover:text-cream"
              >
                <IconX className="h-3.5 w-3.5" /> Filtrlarni tozalash ({activeCount})
              </button>
            )}
          </div>
        </aside>

        {/* ============ RESULTS ============ */}
        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-ink-soft">
              <span className="font-extrabold text-ink">{filtered.length}</span> ta guldasta
              {category !== "all" && (
                <>
                  {" "}
                  · <span className="font-bold text-terra">{CATEGORIES.find((c) => c.key === category)?.label}</span>
                </>
              )}
            </p>
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="text-xs font-extrabold tracking-[0.15em] uppercase">
                Saralash:
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="cursor-pointer rounded-full border border-ink/15 bg-linen px-4 py-2.5 text-sm font-bold focus:border-terra focus:outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="grid place-items-center rounded-2xl border border-dashed border-ink/20 bg-linen/60 px-6 py-24 text-center">
              <IconFlower className="h-14 w-14 text-sand" />
              <h3 className="mt-5 font-display text-2xl font-semibold">Hech narsa topilmadi</h3>
              <p className="mt-2 max-w-sm text-sm text-ink-soft">
                Filtrlarni biroz bo'shatib ko'ring — yoki ustaxonabizga qo'ng'iroq qiling, siz
                uchun maxsus guldasta yig'amiz.
              </p>
              <button
                onClick={reset}
                className="mt-6 rounded-full bg-leaf px-6 py-3 text-xs font-extrabold tracking-[0.2em] text-cream uppercase transition-colors hover:bg-terra"
              >
                Filtrlarni tozalash
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(i, 5) * 60}>
                  <ProductCard product={p} onOpen={onOpen} onAdd={onAdd} />
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-12 rounded-2xl bg-leaf p-8 text-cream md:flex md:items-center md:justify-between">
            <div>
              <h3 className="font-display text-2xl font-semibold">Nima kerakligini bilmasizmi?</h3>
              <p className="mt-1 text-sm text-cream/75">
                Telefon qiling — 2 daqiqada sizga mos guldasta tanlab beramiz.
              </p>
            </div>
            <a
              href="tel:+998712000000"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-cream px-7 py-4 text-sm font-extrabold tracking-wide text-leaf-deep uppercase transition-all hover:-translate-y-0.5 hover:bg-rose md:mt-0"
            >
              +998 71 200-00-00
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

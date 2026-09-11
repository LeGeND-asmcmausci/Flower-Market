import { cn } from "../Utils/Cn";
import {
  TAG_LABEL,
  colorInfo,
  formatPrice,
  type Product,
} from "../Data/Products";
import { IconBag, Stars } from "./Ui";

export function ProductCard({
  product,
  onOpen,
  onAdd,
  className,
}: {
  product: Product;
  onOpen: (p: Product) => void;
  onAdd: (p: Product) => void;
  className?: string;
}) {
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  return (
    <article
      className={cn(
        "group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-sand bg-linen transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_45px_-24px_rgba(35,41,27,0.4)]",
        className
      )}
      onClick={() => onOpen(product)}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.img}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-col gap-1.5">
            {product.tag && (
              <span
                className={cn(
                  "w-fit rounded-full px-3 py-1 text-[10px] font-extrabold tracking-[0.15em] uppercase",
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
              <span className="w-fit rounded-full bg-ink/80 px-3 py-1 text-[10px] font-extrabold tracking-[0.15em] text-cream uppercase">
                −{discount}%
              </span>
            )}
          </div>
        </div>
        {/* quick add */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd(product);
          }}
          aria-label="Savatga qo'shish"
          className="absolute inset-x-3 bottom-3 flex translate-y-[130%] items-center justify-center gap-2 rounded-full bg-cream/95 py-3 text-[13px] font-extrabold tracking-wide text-ink uppercase shadow-lg backdrop-blur transition-all duration-400 group-hover:translate-y-0 hover:bg-terra hover:text-cream"
        >
          <IconBag className="h-4 w-4" />
          Savatga qo'shish
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold tracking-[0.18em] text-sage uppercase">
            {product.category}
          </span>
          <span className="flex items-center gap-2">
            <span className="flex gap-1">
              {product.colors.map((c) => (
                <span
                  key={c}
                  title={colorInfo(c).label}
                  className="h-2.5 w-2.5 rounded-full border border-ink/10"
                  style={{ background: colorInfo(c).hex }}
                />
              ))}
            </span>
          </span>
        </div>
        <h3 className="font-display text-xl leading-tight font-semibold transition-colors group-hover:text-terra">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-ink-soft">
          <Stars rating={product.rating} />
          <span>
            {product.rating.toFixed(1)} · {product.reviews} ta baho
          </span>
        </div>
        <div className="mt-auto flex items-baseline gap-2 pt-1.5">
          <span className="text-lg font-extrabold">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-sm text-ink-soft/60 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

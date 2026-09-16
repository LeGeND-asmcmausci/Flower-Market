import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "../Utils/Cn";

/* ================= Icons (custom inline SVG) ================= */

type IconProps = { className?: string };
const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconFlower = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <circle cx="12" cy="9" r="2.2" />
    <path d="M12 6.8c-.4-2.2.6-3.6 1.9-4.3 1.2 1.1 1.4 2.9.3 4.4M14 10.4c2-.9 3.7-.5 4.8.7-.8 1.4-2.6 2-4.3 1.3M12.2 11.3c.2 2.2-.8 3.6-2.2 4.2-1.1-1.2-1.1-3 .1-4.4M10.1 9.4C8 8.9 6.4 9.5 5.4 10.8c1 1.3 2.8 1.6 4.3.8" />
    <path d="M12 11.2V21M12 16.5c-1.8-.3-3-1.5-3.4-3.2M12 18.6c1.7-.2 2.9-1.2 3.4-2.8" />
  </svg>
);

export const IconBag = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M5.5 8.5h13l-1 11a1.8 1.8 0 0 1-1.8 1.6H8.3a1.8 1.8 0 0 1-1.8-1.6l-1-11Z" />
    <path d="M8.8 8.2V7a3.2 3.2 0 0 1 6.4 0v1.2" />
    <path d="M9.6 12.5c.4 1.4 1.3 2.2 2.4 2.2s2-.8 2.4-2.2" />
  </svg>
);

export const IconLeaf = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M19.5 4.5C12 4 5.5 8 5 15c-.1 2 .6 3.6 1.5 4.5C8 15 12 10 19.5 4.5Z" />
    <path d="M5.8 19.2C9 15.5 13 12 17.5 8.8" />
  </svg>
);

export const IconStar = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 3.2 14.7 9l6.1.6-4.6 4.1 1.3 6-5.5-3.2-5.5 3.2 1.3-6L3.2 9.6 9.3 9 12 3.2Z" />
  </svg>
);

export const IconArrow = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M4 12h15M13.5 5.5 20 12l-6.5 6.5" />
  </svg>
);

export const IconTruck = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M2.5 6.5h11v10h-11zM13.5 9.5h4l3 3.5v3.5h-7" />
    <circle cx="6.5" cy="17.5" r="1.8" />
    <circle cx="16.5" cy="17.5" r="1.8" />
  </svg>
);

export const IconScissors = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <circle cx="6" cy="7" r="2.5" />
    <circle cx="6" cy="17" r="2.5" />
    <path d="M8.2 8.4 20 17M8.2 15.6 20 7M13.6 12.2l1.6 1.2" />
  </svg>
);

export const IconRibbon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M4 9.5h16v10H4zM4 9.5 2.5 21M20 9.5 21.5 21" />
    <path d="M4 9.5h16M12 9.5v10" />
    <path d="M12 9.5C9 9.5 7.2 7.8 7.5 5.8 9.2 5 11.2 5.6 12 9.5c.8-3.9 2.8-4.5 4.5-3.7.3 2-1.5 3.7-4.5 3.7Z" />
  </svg>
);

export const IconClock = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7v5.2l3.4 2" />
  </svg>
);

export const IconPhone = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M5 4.5C5 4.5 4 6 4.5 8.5c1 5 5.5 9.5 10.5 10.5 2.5.5 4-.5 4-.5l1-2-4-2.5-1.8 1.8c-2-1-3.8-2.8-4.8-4.8L11.5 9.5 9 4.5 5 4.5Z" />
  </svg>
);

export const IconMail = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4.5 7.5 7.5 6 7.5-6" />
  </svg>
);

export const IconPin = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" />
    <circle cx="12" cy="9.8" r="2.3" />
  </svg>
);

export const IconSearch = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.5 15.5 5 5" />
  </svg>
);

export const IconX = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconMenu = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M4 7h16M4 12h10M4 17h16" />
  </svg>
);

export const IconPlus = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconMinus = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M5 12h14" />
  </svg>
);

export const IconTrash = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M5 7h14M9.5 7V5h5v2M7 7l.8 12.2h8.4L17 7M10.2 10.5v5.5M13.8 10.5v5.5" />
  </svg>
);

export const IconCheck = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const IconEdit = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M16.5 3.5 20.5 7.5 8 20H4v-4L16.5 3.5Z" />
    <path d="M14 6 18 10" />
  </svg>
);

export const IconLock = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
  </svg>
);

export const IconEye = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IconEyeOff = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <path d="M1 1l22 22" />
    <path d="M10.73 17.08A10.05 10.05 0 0 1 12 20c-7 0-10-8-10-8a18.45 18.45 0 0 1 5.06-5.94" />
  </svg>
);

export const IconDrop = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M12 3.5S6 10 6 14.5a6 6 0 0 0 12 0C18 10 12 3.5 12 3.5Z" />
    <path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" />
  </svg>
);

export const IconTg = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M20.5 4.5 3.8 11.2c-.9.4-.9 1.6.1 1.9l4 1.3 1.6 4.6c.3.9 1.4 1 2 .3l2.2-2.4 4 3c.8.6 1.9.2 2.1-.8l2.3-13c.2-1.1-.8-2-1.6-1.6Z" />
    <path d="m7.9 14.4 9.5-7.4-7.4 8.3-.4 3.3" />
  </svg>
);

export const IconInsta = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="16.8" cy="7.2" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

/* ================= Scroll reveal ================= */

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article" | "figure";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={cn("reveal", inView && "is-in", className)}
      style={{ "--rd": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/* ================= Falling petals ================= */

const PETAL_PATH =
  "M12 2C7 6 4.5 11 6.5 16c1.3 3.2 4.2 5 5.5 5s4.2-1.8 5.5-5c2-5-.5-10-5.5-14Z";

export function Petals({ count = 14, className }: { count?: number; className?: string }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const size = 10 + Math.random() * 16;
        const hues = ["#dfa18f", "#c2593b", "#e9c5a8", "#b98a3e"];
        return {
          id: i,
          left: Math.random() * 100,
          size,
          dur: 9 + Math.random() * 9,
          delay: -Math.random() * 18,
          sway: (Math.random() - 0.5) * 90,
          rot: 200 + Math.random() * 260,
          op: 0.35 + Math.random() * 0.45,
          color: hues[i % hues.length],
        };
      }),
    [count]
  );
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {petals.map((p) => (
        <svg
          key={p.id}
          viewBox="0 0 24 24"
          className="petal"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              "--dur": `${p.dur}s`,
              "--delay": `${p.delay}s`,
              "--sway": `${p.sway}px`,
              "--rot": `${p.rot}deg`,
              "--op": p.op,
            } as CSSProperties
          }
        >
          <path d={PETAL_PATH} fill={p.color} opacity="0.9" />
        </svg>
      ))}
    </div>
  );
}

/* ================= Marquee ================= */

export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = (key: string, hidden?: boolean) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={hidden}>
      {items.map((it, i) => (
        <span key={i} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-sans text-sm font-bold tracking-[0.22em] uppercase md:px-8">
            {it}
          </span>
          <IconFlower className="h-5 w-5 opacity-80" />
        </span>
      ))}
    </div>
  );
  return (
    <div className={cn("relative flex overflow-hidden", className)}>
      <div className="flex min-w-full shrink-0 animate-marquee items-center">
        {row("a")}
        {row("b", true)}
      </div>
    </div>
  );
}

/* ================= Stars ================= */

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-gold", className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <IconStar key={i} className={cn("h-3.5 w-3.5", i > Math.round(rating) && "opacity-25")} />
      ))}
    </span>
  );
}

/* ================= Section heading ================= */

export function Overline({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "flex items-center gap-2.5 text-[11px] font-extrabold tracking-[0.3em] uppercase",
        className
      )}
    >
      <IconFlower className="h-4 w-4" />
      {children}
    </p>
  );
}

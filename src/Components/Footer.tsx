import type { Nav, Page } from "../Utils/types";
import { CATEGORIES } from "../Data/Products";
import { IconFlower, IconInsta, IconMail, IconPhone, IconPin, IconTg } from "./Ui";

export function Footer({ nav }: { nav: Nav }) {
  const quick: { label: string; page: Page }[] = [
    { label: "Bosh sahifa", page: { name: "home" } },
    { label: "Katalog", page: { name: "catalog", category: "all" } },
    { label: "Biz haqimizda", page: { name: "about" } },
    { label: "Aloqa", page: { name: "contact" } },
    { label: "Savat", page: { name: "cart" } },
  ];

  return (
    <footer className="relative overflow-hidden bg-leaf-deep text-cream">
      <div className="pointer-events-none absolute -right-10 -bottom-24 select-none font-display text-[26vw] leading-none font-semibold text-cream/[0.04] italic">
        gul
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 md:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-cream text-leaf-deep">
              <IconFlower className="h-6 w-6" />
            </span>
            <span className="font-display text-2xl font-semibold">
              GULLAR<span className="text-rose">.</span>
            </span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/70">
            2016-yildan beri Toshkentda. Har bir guldasta ustaxonamizda qo'lda yig'iladi — xushsmay,
            xushbo'y, xotira qoladigan.
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { icon: IconInsta, label: "Instagram" },
              { icon: IconTg, label: "Telegram" },
              { icon: IconMail, label: "Email" },
            ].map(({ icon: I, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                onClick={(e) => e.preventDefault()}
                className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 text-cream/80 transition-all duration-300 hover:-translate-y-1 hover:border-rose hover:text-rose"
              >
                <I className="h-4.5 w-4.5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-extrabold tracking-[0.25em] text-rose uppercase">Navigatsiya</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {quick.map((q) => (
              <li key={q.label}>
                <button
                  onClick={() => nav(q.page)}
                  className="group inline-flex items-center gap-2 text-cream/70 transition-colors hover:text-cream"
                >
                  <span className="h-px w-4 bg-rose/50 transition-all group-hover:w-6 group-hover:bg-rose" />
                  {q.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-extrabold tracking-[0.25em] text-rose uppercase">Kolleksiyalar</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.key}>
                <button
                  onClick={() => nav({ name: "catalog", category: c.key })}
                  className="group inline-flex items-center gap-2 text-cream/70 transition-colors hover:text-cream"
                >
                  <span className="h-px w-4 bg-rose/50 transition-all group-hover:w-6 group-hover:bg-rose" />
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-extrabold tracking-[0.25em] text-rose uppercase">Aloqa</h4>
          <ul className="mt-5 space-y-4 text-sm text-cream/70">
            <li className="flex items-start gap-3">
              <IconPhone className="mt-0.5 h-4 w-4 shrink-0 text-rose" />
              <div>
                <p className="font-bold text-cream">+998 71 200-00-00</p>
                <p>Har kuni 08:00 — 21:00</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <IconPin className="mt-0.5 h-4 w-4 shrink-0 text-rose" />
              <p>Chilonzor-7, Bunyodkor ko'chasi 45</p>
            </li>
            <li className="flex items-start gap-3">
              <IconMail className="mt-0.5 h-4 w-4 shrink-0 text-rose" />
              <p>salom@gullar.uz</p>
            </li>
          </ul>
        </div>
      </div>
            <div className="relative border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-cream/50 md:flex-row md:px-8">
          <p>© 2025 GULLAR. Barcha huquqlar himoyalangan.</p>
          <p>
            React + Tailwind CSS bilan <span className="text-rose">qo'l mehnati</span> bilan yaratildi
          </p>
          <button onClick={() => nav({ name: "admin" })} className="transition-colors hover:text-cream">
            Admin
          </button>
        </div>
      </div>
    </footer>
  );
}

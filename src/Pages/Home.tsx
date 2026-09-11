import { useState } from "react";
import type { Nav } from "../Utils/types";
import { CATEGORIES, PRODUCTS, px, type Product } from "../Data/Products";
import { ProductCard } from "../Components/ProductCard";
import {
  IconArrow,
  IconClock,
  IconFlower,
  IconRibbon,
  IconScissors,
  IconStar,
  IconTruck,
  Marquee,
  Overline,
  Petals,
  Reveal,
  Stars,
} from "../Components/Ui";

const STATS = [
  { value: "12 400+", label: "yetkazilgan buyurtma" },
  { value: "4.9/5", label: "mijoz bahosi" },
  { value: "60 daq", label: "shahar ichida yetkazish" },
  { value: "150+", label: "gul turlari omborda" },
];

const STEPS = [
  {
    n: "01",
    icon: IconScissors,
    title: "Siz tanlaysiz",
    text: "Katalogdan tayyor guldastani yoki o'zingiz xohlagan ranglarni tanlashingiz kifoya. Ixtiyoriy — qo'lda yozilgan kartochka qo'shamiz.",
  },
  {
    n: "02",
    icon: IconFlower,
    title: "Biz yig'amiz",
    text: "Ustaxona ustalarimiz ertalab bozordan yetib kelgan eng qadriy gullardan 40 daqiqa ichida guldastangizni qo'lda shakllantiradi.",
  },
  {
    n: "03",
    icon: IconTruck,
    title: "Yetkazamiz",
    text: "Shahar ichida 60 daqiqada, sovuq zanjirli qutida. Kuryer guldastani qo'lda, ehtiyotkorlik bilan topshiradi — va xatini aytadi.",
  },
];

const TESTIMONIALS = [
  {
    name: "Dilnoza A.",
    role: "Toshkent sh.",
    text: "Erimning tug'ilgan kuniga 7:50 da buyurtma berdim — 9:10 da allaqachon qo'lda edi. Rustarlar shu qadar qadriy ediki, 9 kunga qoldi.",
    rating: 5,
  },
  {
    name: "Javohir T.",
    role: "Onamga sovg'a",
    text: "«Oq orzu»ni onamning 60 yoshiga oldim. Kuryer suv bilan birga keltirdi, kartochkaga xatimni qo'lda yozib qo'yishdi. Onam yig'lab yubordi — yaxshi ma'noda.",
    rating: 5,
  },
  {
    name: "Madina K.",
    role: "Kasb: arxitekt",
    text: "Ofis uchun «Sukunat»ni oldik — 8 oydan beri suvsiz turgan holda hali ham interyerimizning markazi. Darralar toifasi apaydi.",
    rating: 4.8,
  },
];

export function Home({
  nav,
  onOpen,
  onAdd,
}: {
  nav: Nav;
  onOpen: (p: Product) => void;
  onAdd: (p: Product) => void;
}) {
  const hits = PRODUCTS.filter((p) => p.tag === "hit" || p.tag === "new").slice(0, 8);
  const [email, setEmail] = useState("");
  const [subbed, setSubbed] = useState(false);

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <Petals count={16} />
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-rose/25 blur-3xl" />
        <div className="pointer-events-none absolute top-40 right-0 h-80 w-80 rounded-full bg-sage/25 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-12 pb-16 md:px-8 lg:grid-cols-12 lg:gap-8 lg:pt-16 lg:pb-24">
          <div className="lg:col-span-7">
            <Overline className="text-terra">Toshkent · 2016-dan beri gullar ustaxonasi</Overline>
            <h1 className="mt-6 font-display text-[13vw] leading-[0.98] font-semibold tracking-tight text-ink sm:text-6xl lg:text-[4.6rem] xl:text-[5.2rem]">
              <span className="mask-line" style={{ "--d": "0.05s" } as React.CSSProperties}>
                <span>Siz his-tuyg'uni</span>
              </span>
              <span className="mask-line" style={{ "--d": "0.18s" } as React.CSSProperties}>
                <span>
                  aytasiz — <em className="text-terra italic">biz uni</em>
                </span>
              </span>
              <span className="mask-line" style={{ "--d": "0.31s" } as React.CSSProperties}>
                <span>
                  <em className="italic">gullarga</em> o'ramiz<span className="text-terra">.</span>
                </span>
              </span>
            </h1>
            <Reveal delay={450}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft md:text-lg">
                Har kuni ertalab Gollandiya va Xorazmdan yangi gullar yetib keladi. Guldastangiz 40
                daqiqada qo'lda yig'iladi, 60 daqiqada esigingizda.
              </p>
            </Reveal>
            <Reveal delay={550} className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => nav({ name: "catalog", category: "all" })}
                className="group inline-flex items-center gap-3 rounded-full bg-leaf px-7 py-4 text-sm font-extrabold tracking-wide text-cream uppercase transition-all duration-300 hover:-translate-y-1 hover:bg-terra hover:shadow-[0_18px_35px_-15px_rgba(194,89,59,0.6)]"
              >
                Katalogni ko'rish
                <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => nav({ name: "about" })}
                className="group inline-flex items-center gap-2 px-2 py-4 text-sm font-extrabold tracking-wide text-ink uppercase transition-colors hover:text-terra"
              >
                Biz haqimizda
                <span className="block h-px w-8 bg-current transition-all duration-300 group-hover:w-12" />
              </button>
            </Reveal>

            <Reveal delay={650}>
              <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-ink/10 pt-7 sm:grid-cols-4">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <dt className="order-2 text-xs leading-snug text-ink-soft">{s.label}</dt>
                    <dd className="font-display text-3xl font-semibold text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Arch image collage */}
          <div className="relative lg:col-span-5">
            <Reveal delay={250} className="relative mx-auto max-w-md">
              <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[2rem] border-8 border-linen shadow-[0_40px_70px_-35px_rgba(35,41,27,0.5)]">
                <img
                  src={px(6641386, 900)}
                  alt="Ustaxonada guldasta yig'ish"
                  className="aspect-[4/5.3] w-full animate-kenburns object-cover"
                />
              </div>
              {/* rotating flower badge */}
              <div className="absolute -top-5 -right-4 grid h-28 w-28 place-items-center rounded-full bg-terra text-cream shadow-xl md:-right-8">
                <div className="grid h-full w-full animate-spin-slow place-items-center">
                  <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
                    <defs>
                      <path id="circ" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
                    </defs>
                    <text className="fill-cream text-[11.5px] font-bold tracking-[0.3em] uppercase">
                      <textPath href="#circ">· Qo'lda yig'iladi · 60 daqiqada </textPath>
                    </text>
                  </svg>
                </div>
                <IconFlower className="absolute h-8 w-8" />
              </div>
              {/* postcard */}
              <figure className="absolute -bottom-8 -left-4 w-40 -rotate-6 overflow-hidden rounded-xl border-4 border-linen shadow-xl transition-transform duration-500 hover:rotate-0 md:-left-10 md:w-48">
                <img src={px(6720581, 600)} alt="Do'konda guldasta topshirish" className="aspect-square w-full object-cover" />
              </figure>
              <figure className="absolute -right-3 -bottom-14 hidden w-32 rotate-6 overflow-hidden rounded-xl border-4 border-linen shadow-xl transition-transform duration-500 hover:rotate-0 sm:block md:-right-8 md:w-36">
                <img src={px(38618585, 600)} alt="Gullar do'koni ichki ko'rinishi" className="aspect-square w-full object-cover" />
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <Marquee
        items={[
          "Tasodifiy guldasta",
          "60 daqiqada yetkazish",
          "3 kun saqlanish kafolati",
          "Bepul qo'lda kartochka",
          "150+ gul turi",
          "Xonadongacha yetkazamiz",
        ]}
        className="border-y border-leaf-deep/20 bg-leaf text-cream py-4"
      />

      {/* ============ COLLECTIONS ============ */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Overline className="text-terra">Kolleksiyalar</Overline>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
              Qaysi guldasta
              <br />
              <em className="text-terra italic">izlayapsiz?</em>
            </h2>
          </div>
          <button
            onClick={() => nav({ name: "catalog", category: "all" })}
            className="group inline-flex items-center gap-2 text-sm font-extrabold tracking-wide uppercase transition-colors hover:text-terra"
          >
            Barcha mahsulotlar
            <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.key} delay={i * 90}>
              <button
                onClick={() => nav({ name: "catalog", category: c.key })}
                className="group relative block w-full overflow-hidden rounded-2xl text-left"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.label}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <div className="absolute right-0 bottom-0 left-0 p-5">
                  <p className="text-[10px] font-bold tracking-[0.25em] text-rose uppercase">{c.note}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <h3 className="font-display text-2xl font-semibold text-cream">{c.label}</h3>
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-cream/15 text-cream backdrop-blur transition-all duration-300 group-hover:rotate-45 group-hover:bg-terra">
                      <IconArrow className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ BESTSELLERS RAIL ============ */}
      <section className="border-y border-sand bg-linen/70 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Overline className="text-terra">Ommabop</Overline>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
                Eng ko'p olinadigan <em className="text-terra italic">guldastalar</em>
              </h2>
            </div>
            <p className="max-w-xs text-sm text-ink-soft">
              «Chapga–o'ngga suring» — xit va yangi kelgan guldastalar shu yerda.
            </p>
          </div>
        </div>
        <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:px-8 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          {hits.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onOpen={onOpen}
              onAdd={onAdd}
              className="w-[75vw] shrink-0 snap-start sm:w-[46vw] md:w-[320px]"
            />
          ))}
        </div>
      </section>

      {/* ============ PROCESS (sticky two-column) ============ */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Overline className="text-terra">Jarayon</Overline>
            <h2 className="mt-4 font-display text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
              Uch qadam —<br />
              va <em className="text-terra italic">gul sizda.</em>
            </h2>
            <p className="mt-5 max-w-sm leading-relaxed text-ink-soft">
              Buyurtmadan yetkazishgacha o'rtacha 45 daqiqa. Jarayonni telefonda kuzatib
              boringiz: qaysi ustaxona o'rgana boshlagani, quriyer yo'lga chiqqani — hammasini
              xabar qilamiz.
            </p>
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-sand bg-linen p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-leaf text-cream">
                <IconClock className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-xl font-semibold">08:00 — 21:00</p>
                <p className="text-sm text-ink-soft">har kuni ishlaymiz, dam olish kuni ham</p>
              </div>
            </div>
            <button
              onClick={() => nav({ name: "catalog", category: "all" })}
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-terra px-7 py-4 text-sm font-extrabold tracking-wide text-cream uppercase transition-all duration-300 hover:-translate-y-1 hover:bg-leaf"
            >
              Bugun buyurtma berish
              <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <ol className="space-y-5">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} as="li" delay={i * 100}>
                <div className="group flex gap-5 rounded-2xl border border-sand bg-linen p-6 transition-all duration-500 hover:-translate-y-1 hover:border-terra/40 hover:shadow-[0_20px_40px_-24px_rgba(194,89,59,0.45)] md:p-8">
                  <span className="font-display text-5xl font-light text-sand transition-colors duration-500 group-hover:text-terra/50 md:text-6xl">
                    {s.n}
                  </span>
                  <div>
                    <span className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-cream text-terra">
                      <s.icon className="h-5.5 w-5.5" />
                    </span>
                    <h3 className="font-display text-2xl font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ BANNER ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={px(5409696, 1600)}
            alt=""
            className="h-full w-full animate-kenburns object-cover"
          />
          <div className="absolute inset-0 bg-leaf-deep/70" />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-24 md:px-8 lg:py-32">
          <Overline className="text-rose">Nega GULLAR?</Overline>
          <h2 className="max-w-2xl font-display text-4xl leading-tight font-semibold text-cream md:text-6xl">
            Gul — bu <em className="text-rose italic">so'zsiz til</em>.
          </h2>
          <p className="max-w-md text-cream/80">
            9 yildan beri bitta ishni qilamiz — insonlarni xursand qilamiz. 12 400 dan ortiq
            guldasta yetkazdik, har biri boshqacha hikoya.
          </p>
          <button
            onClick={() => nav({ name: "catalog", category: "all" })}
            className="group inline-flex items-center gap-3 rounded-full bg-cream px-7 py-4 text-sm font-extrabold tracking-wide text-leaf-deep uppercase transition-all duration-300 hover:-translate-y-1 hover:bg-rose hover:text-ink"
          >
            Guldasta tanlash
            <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 lg:py-28">
        <div className="text-center">
          <Overline className="justify-center text-terra">Mijozlarimiz so'zi</Overline>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Gullarga <em className="text-terra italic">ishonch bildirishdi</em>
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 110}>
              <figure className="flex h-full flex-col rounded-2xl border border-sand bg-linen p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_45px_-24px_rgba(35,41,27,0.35)]">
                <Stars rating={t.rating} className="scale-110 origin-left" />
                <blockquote className="mt-4 flex-1 font-display text-lg leading-relaxed text-ink/90 italic">
                  «{t.text}»
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-sand pt-5">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-leaf font-display text-lg font-semibold text-cream">
                    {t.name[0]}
                  </span>
                  <div>
                    <p className="text-sm font-extrabold">{t.name}</p>
                    <p className="text-xs text-ink-soft">{t.role}</p>
                  </div>
                  <IconStar className="ml-auto h-4 w-4 text-gold" />
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ NEWSLETTER ============ */}
      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-terra px-6 py-14 text-center text-cream md:px-16">
            <IconFlower className="absolute -top-8 -left-8 h-40 w-40 rotate-12 text-cream/10" />
            <IconFlower className="absolute -right-10 -bottom-10 h-48 w-48 -rotate-12 text-cream/10" />
            <Petals count={8} />
            <Overline className="justify-center text-cream/80">Xushxabar xatlari</Overline>
            <h2 className="mx-auto mt-4 max-w-xl font-display text-3xl font-semibold tracking-tight md:text-5xl">
              Har seshab — yangi guldastalar va maxfiy chegirmalar
            </h2>
            {subbed ? (
              <p className="mx-auto mt-8 max-w-md rounded-full bg-cream/15 px-6 py-4 font-bold">
                Rahmat! Birinchi xushxabar xati dushanba kuni sizning pochtagizda bo'ladi.
              </p>
            ) : (
              <form
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setSubbed(true);
                }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Pochtangizni kiriting"
                  className="w-full flex-1 rounded-full border border-cream/30 bg-cream/10 px-6 py-4 text-sm text-cream placeholder:text-cream/60 focus:border-cream focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-leaf-deep px-7 py-4 text-sm font-extrabold tracking-wide uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink"
                >
                  Obuna bo'lish
                </button>
              </form>
            )}
            <p className="mt-4 text-xs text-cream/60">Spam yo'q. Har oy bitta xat, faqat eng chiroyli yangiliklar.</p>
          </div>
        </Reveal>
      </section>

      {/* ============ PROMISE STRIP ============ */}
      <section className="border-t border-sand bg-linen/60">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 md:px-8">
          {[
            { icon: IconTruck, t: "Shahar ichida 60 daqiqada", d: "Chilonzor, Yunusobod, Mirzo Ulug'bek, Yashnobod va boshqa tumanlar." },
            { icon: IconRibbon, t: "3 kun saqlanish kafolati", d: "Gul xiralashsa — aybimiz bo'lsa, almashtiramiz. Shartlarsiz." },
            { icon: IconScissors, t: "Har biri qo'lda yig'iladi", d: "Fabrika yo'q: har bir guldastani ustaxona ustasi shakllantiradi." },
          ].map((b, i) => (
            <Reveal key={b.t} delay={i * 90} className="flex gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-leaf text-cream">
                <b.icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold">{b.t}</h3>
                <p className="mt-1 text-sm text-ink-soft">{b.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

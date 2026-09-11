import { useState } from "react";
import type { Nav } from "../Utils/types";
import { px } from "../Data/Products";
import {
  IconArrow,
  IconClock,
  IconDrop,
  IconFlower,
  IconLeaf,
  IconMail,
  IconPhone,
  IconPin,
  IconScissors,
  IconTg,
  IconCheck,
  Overline,
  Petals,
  Reveal,
} from "../Components/Ui";

/* ================= ABOUT ================= */

const VALUES = [
  {
    icon: IconLeaf,
    t: "Tabiiylik",
    d: "G'ovak va sun'iy gullar ishlatmaymiz. Faqat tirik, erta kesilgan gullar.",
  },
  {
    icon: IconScissors,
    t: "Qo'l mehnati",
    d: "Har bir guldastani ustaxona ustasi shakllantiradi — fabrika yo'q.",
  },
  {
    icon: IconDrop,
    t: "Xavfsiz yetkazish",
    d: "Sovuq zanjirli qutilar — gul esigingizda ham ertalabki holatida bo'ladi.",
  },
  {
    icon: IconFlower,
    t: "Xotira",
    d: "Gul 3 kun turadi, lekin o'sha kun — butun umr esda qoladi.",
  },
];

export function About({ nav }: { nav: Nav }) {
  return (
    <div>
      {/* Head */}
      <section className="relative overflow-hidden">
        <Petals count={10} />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8 lg:py-24">
          <Overline className="text-terra">Biz haqimizda</Overline>
          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.02] font-semibold tracking-tight md:text-7xl">
            2016-yilda bitta <em className="text-terra italic">burchakdagi</em> do'kon bilan
            boshladik.
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8 lg:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <div className="overflow-hidden rounded-[2rem] rounded-t-[999px] border-8 border-linen shadow-[0_40px_70px_-35px_rgba(35,41,27,0.5)]">
              <img
                src={px(5414331, 900)}
                alt="Ustaxonamizda"
                className="aspect-[4/4.8] w-full animate-kenburns object-cover"
              />
            </div>
            <figure className="absolute -right-4 -bottom-10 w-40 rotate-6 overflow-hidden rounded-xl border-4 border-linen shadow-xl transition-transform duration-500 hover:rotate-0 md:-right-10 md:w-52">
              <img src={px(6720594, 600)} alt="Mijoz bilan suhbat" className="aspect-square w-full object-cover" />
            </figure>
          </Reveal>
          <Reveal delay={120}>
            <Overline className="text-terra">Bizning hikoyamiz</Overline>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Bugun 9 kishilik ustaxona <em className="text-terra italic">va 12 400+</em> xursand
              mijoz
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-ink-soft">
              <p>
                Boshida biz uch kishilik kichik do'konda ishlar edi: oshxona ustida gullar
                o'ram, mahalladagilar chetga olar edi. Birinchi yilda 340 ta buyurtma qabul
                qildik — hamma «gullar qimmati» deb aytdi.
              </p>
              <p>
                Bugun Chilonzordagi ustaxonamizda 9 talarimiz har kuni ertalab 5 da Xorazm
                bozorida, keyin ertalab 7 da — ustxonada turamiz. 12 400 dan ortiq guldasta
                yetkazdik: to'yga, yoshligiga, «shunchaki o'yladim»ga.
              </p>
              <p>
                Bir narsa hech qachon o'zgarmadi: har bir guldasta hali ham qo'lda yig'iladi.
                Chunki maqsadimiz — gullar, his-tuyg'ular.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-ink/10 pt-7">
              {[
                { v: "9", l: "yillik tajriba" },
                { v: "4", l: "gullar omborlari" },
                { v: "98%", l: "mijozlar qaytadi" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-4xl font-semibold text-terra">{s.v}</p>
                  <p className="mt-1 text-xs text-ink-soft">{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-sand bg-linen/70 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center">
            <Overline className="justify-center text-terra">Qadriyatlar</Overline>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
              Nimalarga <em className="text-terra italic">amalamiz</em>
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={i * 90}>
                <div className="group h-full rounded-2xl border border-sand bg-cream p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-terra/40 hover:shadow-[0_20px_40px_-24px_rgba(194,89,59,0.4)]">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-leaf text-cream transition-transform duration-500 group-hover:rotate-[30deg]">
                    <v.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold">{v.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 text-center md:px-8">
        <Reveal>
          <h2 className="mx-auto max-w-2xl font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Keyingi xursand inson — <em className="text-terra italic">o'shdamiz</em>
          </h2>
          <button
            onClick={() => nav({ name: "catalog", category: "all" })}
            className="group mt-8 inline-flex items-center gap-3 rounded-full bg-leaf px-8 py-4 text-sm font-extrabold tracking-wide text-cream uppercase transition-all duration-300 hover:-translate-y-1 hover:bg-terra"
          >
            Guldastalarni ko'rish
            <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </Reveal>
      </section>
    </div>
  );
}

/* ================= CONTACT ================= */

export function Contact({ nav }: { nav: Nav }) {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 lg:py-16">
      <nav className="mb-6 flex items-center gap-2 text-xs font-bold tracking-wide text-ink-soft/70">
        <button onClick={() => nav({ name: "home" })} className="transition-colors hover:text-terra">
          Bosh sahifa
        </button>
        <span>/</span>
        <span className="text-ink">Aloqa</span>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Overline className="text-terra">Aloqa</Overline>
          <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight md:text-6xl">
            Keling, <em className="text-terra italic">gaplashamiz</em>
          </h1>
        </div>
        <p className="max-w-xs text-sm text-ink-soft">
          Savol bormi? Maxsus buyurtma kerakmi? Yozing yoki qo'ng'iroq qiling — o'rtacha 4 daqiqada
          javob beramiz.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_420px]">
        {/* Info cards */}
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            {
              icon: IconPhone,
              t: "Telefon",
              d: "+998 71 200-00-00",
              sub: "Har kuni 08:00 — 21:00",
              href: "tel:+998712000000",
            },
            {
              icon: IconMail,
              t: "Pochta",
              d: "salom@gullar.uz",
              sub: "1 soat ichida javob beramiz",
              href: "mailto:salom@gullar.uz",
            },
            {
              icon: IconPin,
              t: "Manzil",
              d: "Chilonzor-7, Bunyodkor 45",
              sub: "Do'kon — kirish erkin",
            },
            {
              icon: IconClock,
              t: "Ish vaqti",
              d: "08:00 — 21:00",
              sub: "Dam olish kuni ham ishlaymiz",
            },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 80}>
              <div className="group h-full rounded-2xl border border-sand bg-linen p-6 transition-all duration-300 hover:-translate-y-1 hover:border-terra/40">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-cream text-terra transition-transform duration-500 group-hover:rotate-[30deg]">
                  <c.icon className="h-5.5 w-5.5" />
                </span>
                <h3 className="mt-4 text-xs font-extrabold tracking-[0.2em] text-ink-soft uppercase">{c.t}</h3>
                {c.href ? (
                  <a href={c.href} className="mt-1 block font-display text-xl font-semibold transition-colors hover:text-terra">
                    {c.d}
                  </a>
                ) : (
                  <p className="mt-1 font-display text-xl font-semibold">{c.d}</p>
                )}
                <p className="mt-1 text-xs text-ink-soft">{c.sub}</p>
              </div>
            </Reveal>
          ))}

          <Reveal delay={340} className="sm:col-span-2">
            <a
              href="https://t.me/"
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.preventDefault()}
              className="group flex items-center justify-between rounded-2xl bg-leaf p-6 text-cream transition-all duration-300 hover:bg-leaf-deep"
            >
              <div className="flex items-center gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-cream/15">
                  <IconTg className="h-5.5 w-5.5" />
                </span>
                <div>
                  <p className="font-display text-xl font-semibold">@gullar_uz</p>
                  <p className="text-xs text-cream/70">Telegramda buyurtma — eng tez usul</p>
                </div>
              </div>
              <IconArrow className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
            </a>
          </Reveal>
        </div>

        {/* Form */}
        <Reveal delay={150}>
          <div className="rounded-2xl border border-sand bg-linen p-7">
            <h2 className="font-display text-2xl font-semibold">Xabar qoldiring</h2>
            {sent ? (
              <div className="mt-8 rounded-xl bg-leaf/10 p-6 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-leaf text-cream">
                  <IconCheck className="h-7 w-7" />
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold">Xabaringiz yetdi!</h3>
                <p className="mt-2 text-sm text-ink-soft">
                  Rahmat, {form.name || "do'st"} — 4 daqiqa ichida qayta bog'lanamiz.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", phone: "", message: "" });
                  }}
                  className="mt-5 text-xs font-extrabold tracking-[0.2em] text-terra uppercase hover:underline"
                >
                  Yangi xabar yozish
                </button>
              </div>
            ) : (
              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div>
                  <label className="text-xs font-extrabold tracking-[0.2em] uppercase">Ismingiz</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ismingizni yozing"
                    className="mt-2 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3.5 text-sm focus:border-terra focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold tracking-[0.2em] uppercase">Telefon</label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+998 __ ___ __ __"
                    className="mt-2 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3.5 text-sm focus:border-terra focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold tracking-[0.2em] uppercase">Xabar</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Nima kerak ekanligini yozing — sana, manzil, byudjet…"
                    className="mt-2 w-full resize-none rounded-xl border border-ink/15 bg-cream px-4 py-3.5 text-sm focus:border-terra focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="group flex w-full items-center justify-center gap-3 rounded-full bg-terra py-4 text-sm font-extrabold tracking-wide text-cream uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-leaf"
                >
                  Yuborish
                  <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ================= ORDER SUCCESS ================= */

export function OrderSuccess({
  orderId,
  nav,
}: {
  orderId: string;
  nav: Nav;
}) {
  return (
    <div className="relative mx-auto max-w-3xl overflow-hidden px-4 py-24 text-center md:px-8">
      <Petals count={12} />
      <Reveal className="relative">
        <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-leaf text-cream shadow-[0_20px_50px_-15px_rgba(49,71,47,0.5)]">
          <IconCheck className="h-12 w-12" />
        </span>
        <p className="mt-8 text-[11px] font-extrabold tracking-[0.3em] text-terra uppercase">
          Buyurtma qabul qilindi
        </p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight md:text-6xl">
          Rahmat<span className="text-terra">!</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-ink-soft">
          <span className="font-extrabold text-ink">#{orderId}</span> raqamli buyurtmangiz
          ustaxonaga yuborildi. 10 daqiqa ichida bitta menejer telefonda bog'lanib, barcha
          tafsilotlarni tasdiqlaydi.
        </p>
        <div className="mx-auto mt-10 flex max-w-md flex-col items-stretch gap-3 rounded-2xl border border-sand bg-linen p-6 text-left sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <IconFlower className="h-8 w-8 text-terra" />
            <div>
              <p className="font-display text-lg font-semibold">{orderId}</p>
              <p className="text-xs text-ink-soft">bugun yetkaziladi</p>
            </div>
          </div>
          <p className="text-xs text-ink-soft">
            Kuryer yo'lga chiqqanda sizga SMS xabar keladi
          </p>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => nav({ name: "home" })}
            className="rounded-full bg-leaf px-8 py-4 text-sm font-extrabold tracking-wide text-cream uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-terra"
          >
            Bosh sahifaga qaytish
          </button>
          <button
            onClick={() => nav({ name: "catalog", category: "all" })}
            className="rounded-full border border-ink/20 px-8 py-4 text-sm font-extrabold tracking-wide text-ink uppercase transition-all duration-300 hover:border-terra hover:text-terra"
          >
            Yana guldasta ko'rish
          </button>
        </div>
      </Reveal>
    </div>
  );
}

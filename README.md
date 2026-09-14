# GULLAR — Flower Market

React + Vite + Tailwind v4 do'koni (Telegram Mini App va Vercel uchun).

## Admin panel

- Manzil: **`/admin`** (masalan `https://flower-market-olive.vercel.app/admin`).
- Saytda hech qanday havola yo'q — faqat to'g'ridan-to'g'ri link orqali ochiladi.
- Login: `admin` · Parol: `gullar-admin-2026`
  (`src/Pages/Admin.tsx` dagi `ADMIN_LOGIN` / `ADMIN_PASSWORD` orqali o'zgartiriladi.)
- U yerda guldastalarni **qo'shish, tahrirlash, o'chirish** va asl katalogni tiklash mumkin.
- Sahifani yangilasangiz ham `/admin` ochilib turadi (`vercel.json` rewrite + URL sync).

### Bulut sinxronizatsiyasi (muhim!)

Admin panel katalogni **JSONBin.io** bulutiga saqlaydi — shu tufayli o'zgarishlar
saytga kirgan **hamma tashrif buyuruvchiga** ko'rinadi (faqat sizning brauzeringizda emas).

Bir marta sozlash (~3 daqiqa):

1. https://jsonbin.io saytida bepul akkaunt oching → **API Keys** → `X-Master-Key` ni nusxalang.
2. Yangi **bin** yarating (mazmuni muhim emas) va bin URL'idan id sini nusxalang.
3. Vercel → Project → **Settings → Environment Variables** bo'limiga ikkita o'zgaruvchi qo'shing:
   - `VITE_JSONBIN_KEY` = X-Master-Key
   - `VITE_JSONBIN_BIN` = bin id
4. **Redeploy** qiling. Lokal uchun esa xuddi shu kalitlarni `my-app/.env.local` fayliga yozing.

Bin bo'sh bo'lsa, ilova birinchi ishga tushganda mavjud katalogni avtomatik yuklaydi.
Admin paneldagi holat chipi: `Bulutga saqlandi` / `Sinxronlanmoqda…` / `Bulutga ulanmadi` /
`Faqat shu brauzerda` (sozlanmagan).

> Katalog bin'da `{ "products": [...] }` ko'rinishida saqlanadi. Xohlasangiz, bin'ga
> to'g'ridan-to'g'ri productlar massivini ham qo'ysangiz bo'ladi — ilova ikkala formatni ham o'qiydi.

### Login/parolni o'zgartirish

`src/Pages/Admin.tsx` faylida:

```ts
const ADMIN_LOGIN = "admin";
const ADMIN_PASSWORD = "gullar-admin-2026";
```

### Xavfsizlik eslatmasi

Login/parol frontenda saqlanadi (statik Vercel sayt uchun oddiy yechim). Foydalanuvchilar
`/admin` linkini bilmagan bo'lsa, panelga chiqa olmaydi. Ammo bu bank-darajasi himoya emas —
maxfiy ma'lumotlar saqlanadigan loyihalarda haqiqiy backend auth kerak bo'ladi.

## Ishga tushirish

```bash
npm install
npm run dev     # lokal development
npm run build   # production build (dist/)
```

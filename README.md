# 🌍 Schedule Share

Jednoduchá a moderná webová aplikácia na **tvorbu a zdieľanie rozvrhov**. Vhodná pre študentov, tímové plánovanie alebo osobné použitie.

---

## ✨ Funkcie

- 🧠 Tvorba vlastného rozvrhu online
- 🔗 Zdieľanie rozvrhu pomocou linku
- 🔐 Prihlásenie a registrácia cez Supabase Auth
- 🌐 Pripravené na globálne použitie (aj bez registrácie)
- 💅 Moderné UI s DaisyUI + Tailwind CSS
- 🚀 Rýchly výkon vďaka React + Vite

---

## 🧱 Použité technológie

| Technológia | Popis |
|------------|-------|
| [React](https://reactjs.org) | Frontend framework |
| [Vite](https://vitejs.dev) | Ultra-rýchly build systém |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS |
| [DaisyUI](https://daisyui.com) | Komponentová knižnica pre Tailwind |
| [Supabase](https://supabase.com) | Backend (Auth, DB, API) |

---

## 🛠️ Inštalácia (lokálne)

```bash
# 1. Klonuj projekt
git clone https://github.com/tvoje-meno/schedule-share.git
cd schedule-share

# 2. Inštaluj závislosti
npm install

# 3. Spusti vývojový server
npm run dev
```

## ⚙️ Konfigurácia

Vytvor `.env` súbor s nasledujúcim obsahom:

```ini
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key

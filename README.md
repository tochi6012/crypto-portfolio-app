# crypto-portfolio-app

A mobile-first crypto portfolio tracker PWA. Add your holdings manually, see live USD prices from CoinGecko, and track your total bag value.

## Features

- Manual coin holdings with search
- Live prices and 24h change
- Total portfolio value
- PWA — installable on mobile
- Data stored in localStorage (no account needed)

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Deploy on Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import `tochi6012/crypto-portfolio-app`
4. Vercel auto-detects Vite — no extra config needed
5. Click **Deploy**

The `vercel.json` file proxies `/api/coingecko/*` to CoinGecko so prices work in production.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

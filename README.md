# Felicio Clone 🎁

Een kloon van [Felicio.nl](https://felicio.nl) - een online bruiloft cadeaulijst platform.

## Features

- 📝 Maak een cadeaulijst met persoonlijke URL
- 🎁 Voeg cadeaus toe met doelbedrag
- 💰 Gasten kunnen bijdragen aan cadeaus
- 💳 Stripe integratie (voorbereid)
- 🔐 Supabase Auth (voorbereid)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Supabase (PostgreSQL) - TODO
- **Payments**: Stripe - TODO
- **Language**: TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── login/            # Login page
│   ├── start/            # Create list wizard
│   ├── dashboard/        # Dashboard + list management
│   └── lijst/[slug]/     # Public list view
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── dashboard-sidebar.tsx
│   ├── gift-dialog.tsx
│   └── contribution-dialog.tsx
├── lib/
│   ├── utils.ts
│   └── mock-data.ts      # Demo data
└── types/
    └── index.ts          # TypeScript types
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Login (mock) |
| `/start` | Create new list wizard |
| `/dashboard` | User dashboard |
| `/dashboard/lijsten` | My lists |
| `/lijst/[slug]` | Public list view |

## TODO

- [ ] Supabase integration (database + auth)
- [ ] Stripe Checkout integration
- [ ] Image upload (cover + gift images)
- [ ] List publishing flow
- [ ] Share functionality
- [ ] Payment settings (IBAN)
- [ ] Admin fee calculation (€49.95 + €0.95/transaction)

## Development Notes

Currently using mock data for demo purposes. Real data will come from Supabase once configured.

---

Built with ❤️ by Marvin 🤖

# BookIt

**Smarter badminton court booking for Tampines residents** — built for **JOM AI Tampines**.

🔗 **[Live demo](https://v0-jomai-booking.vercel.app/)**

BookIt is a prototype facility-booking platform that replaces midnight queue-jumping with a **fair weekly ballot**: residents apply for slots, are ranked by a transparent fairness score (not submission time), and winners are allocated after voting closes. The demo runs entirely in the browser with mock data and `localStorage` — no backend required to try it.

---

## Team BookIt

| Name |
|------|
| Clifton |
| Keene |
| Emmanuel |
| Bryan |
| Barry |

---

## What’s built (this repo)

These features work in the current demo. Items marked *(simulated)* use mock logic or client-only storage, not production integrations.

### Authentication & profiles

| Feature | Notes |
|---------|--------|
| Demo Singpass login | Pick one of three personas on the landing page *(not real Singpass)* |
| User profile | Priority score, tier display, booking preferences from persona |
| Profile settings | Edit display info and photo upload UI |

### Ballot & booking

| Feature | Notes |
|---------|--------|
| Browse courts | Tampines locations, court details, date/time slot picker |
| Ballot applications | Apply for a slot in the **target ballot week** (not instant confirm) |
| Fairness scoring | Score breakdown: elderly priority, “not chosen last week”, demand, etc. |
| Ballot transparency | Public ranked queue, rules, coach applications, cancellation log |
| Ballot rules page | `/rules` — full policy summary |
| Demo weekly allocation | **Run demo allocation** replaces profile bookings from selected entries |
| One pending app per week | Only one `pending` ballot application at a time per user |
| Monthly cap | Max **2** confirmed bookings per calendar month (enforced in logic) |
| Cancellation policy | 36h rule, 50% late fee, waitlist handoff *(demo messaging)* |

### Community

| Feature | Notes |
|---------|--------|
| Matchmaking | Share a slot or join open games — `localStorage` |
| Booking assistant chat | Scripted widget with court suggestions from schedule/budget *(not LLM)* |

### Check-in & admin

| Feature | Notes |
|---------|--------|
| Court check-in | Bluetooth flow on profile *(simulated connection)* |
| Admin dashboard | `/admin` — courts, users, bookings, charts, ballot panel |
| Coach ballot form | CC-reviewed coach track in ballot UI |

### App experience

| Feature | Notes |
|---------|--------|
| Dark mode | System / toggle via theme provider |
| Mobile-friendly UI | Responsive layout across main flows |
| Vercel deploy | Static Next.js build, client-side state |

---

## Roadmap (not built yet)

Planned or aspirational work — see [`ROADMAP.md`](./ROADMAP.md) for phased detail.

### Product

- [ ] Real **Singpass** OIDC (replace demo personas)
- [ ] **PostgreSQL / Supabase** backend and APIs (replace `localStorage`)
- [ ] **Real-time** ballot updates (WebSockets or similar)
- [ ] **Push / email** notifications (reminders, ballot results, last-minute slots)
- [ ] **Web Bluetooth** check-in at the court (replace simulation)
- [ ] **Payments** (PayNow / Stripe) and automated refunds
- [ ] **LLM** booking assistant (replace scripted `lib/chatAssistant.ts`)
- [ ] Multiple pending ballot applications per week (e.g. per court) if policy allows
- [ ] Integration with **OnePA / ActiveSG**-style systems
- [ ] Multilingual UI (EN / MS / ZH / TA)
- [ ] PWA + offline ballot viewing

### Engineering

- [ ] Automated tests (Jest / Playwright)
- [ ] Error monitoring (e.g. Sentry)
- [ ] CI/CD pipeline
- [ ] PDPA / security review for production data

---

## Try the demo

1. Open the app → **Log in with Singpass** → choose a persona:

   | Persona | Role | Good for testing |
   |---------|------|------------------|
   | **Tan Wei Ming** | Resident | Evening budget slots |
   | **Lim Mei Ling** | Elderly | Weekend + elderly priority |
   | **Kumar Rajesh** | Resident | Morning / higher budget |

2. **Home** → pick a court → select date/time → submit a **ballot application**.
3. **Ballot** → view queue, your status, **Run demo allocation** (creates/refreshes profile bookings).
4. **Profile** → upcoming ballot bookings, cancel, **Court check-in**.
5. **Matchmaking** → share or join games.
6. **Admin** → separate admin login on `/admin`.

**Reset demo data:** Ballot page → *Clear my pending* / *Reset demo queues*; clears ballot + booking `localStorage` keys.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com/) (Radix) |
| State | React Context + `localStorage` |
| Hosting | [Vercel](https://vercel.com/) |

---

## Project structure

```
app/
  page.tsx              Landing + Singpass login
  home/                 Court listing
  booking/[courtId]/    Ballot application flow
  ballot/               Transparency + your ballot status
  matchmaking/          Shared games
  profile/              Bookings, check-in, priority
  rules/                Ballot policy
  admin/                Admin dashboard (+ courts)
components/             UI (SingpassLogin, BallotTransparencyPanel, …)
context/                User, Booking, Ballot, Admin providers
lib/
  ballotLogic.ts        Scoring, validation, allocation
  chatAssistant.ts      Scripted chat responses
  data/                 Courts, slots, personas, types
```

---

## Run locally

**Requirements:** Node.js 20+, [pnpm](https://pnpm.io/) (recommended; repo includes `pnpm-lock.yaml`).

```bash
git clone https://github.com/Liquefy7822/jomai-booking-uj
cd jomai-booking-uj
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

No API keys or database setup — data persists in the browser only.

```bash
pnpm build    # production build
pnpm lint     # ESLint
```

---

## Related docs

| File | Purpose |
|------|---------|
| [`ROADMAP.md`](./ROADMAP.md) | Longer-term phases, risks, and planning notes |
| [`PRESENTATION_INFO.md`](./PRESENTATION_INFO.md) | Pitch-style comparison vs ActiveSG (includes aspirational items) |

---

## License

MIT © 2026 **Team BookIt** — JOM AI Tampines

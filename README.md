# 🏸 BookIt
### Smarter facility booking for Tampines residents

> Built for **JOM AI TAMPINES** by Team BookIt

🔗 **[Live Demo](https://v0-jomai-booking.vercel.app/)**

---

## 🚀 What is BookIt?

Booking a badminton court in Tampines shouldn't feel like a battle. BookIt is a modern facility booking platform that reduces booking friction, maximises shared usage of limited sports facilities, and makes the whole experience smoother — for everyone.

No more refreshing pages at midnight. No more empty courts that were "booked". No more going home because your court is full.

---

## ✨ Features

### 🗓️ Court Booking
Browse available courts and time slots in a clean, mobile-friendly interface. Book in seconds.

### 🤝 Matchmaking Board
Open to sharing your court? Toggle it on. Others can see your slot and join you — perfect for solo players looking for a game.

### ⚡ Last Minute Alerts
Slot just freed up? BookIt notifies residents who might be interested to fill the gap fast.

### 📊 Priority Scoring (Behind the Scenes)
Frequent last-minute cancellations? Lower priority. Consistently responsible? Move up the queue. Keeps the system fair without being intrusive.

### 🔧 Admin Panel
Manage courts, bookings, and users from a dedicated admin dashboard.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js + TypeScript |
| Styling | Tailwind CSS |
| State | React Context + localStorage |
| Hosting | Vercel |

---

## 📁 Project Structure

```
/app
  /home               → Browse courts and slots
  /booking/[courtId]  → Book a specific court
  /matchmaking        → Find people to play with
  /profile            → Your bookings and priority score
  /admin              → Admin dashboard
  /register           → User registration
/components           → Reusable UI components
/context              → React context providers
/hooks                → Custom React hooks
/lib                  → Mock data and utilities
/styles               → Global styles
```

---

## 🏃 Running Locally

```bash
git clone https://github.com/Liquefy7822/jomai-booking-uj
cd jomai-booking-uj
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're good to go.

> No API keys or database setup needed — everything runs client side.

---

## 👥 The Team

| Name |
|---|
| Clifton |
| Keene |
| Emmanuel |
| Bryan |
| Barry |

---

## 🔮 Future Plans

- [ ] Real database backend replacing localStorage
- [ ] Bluetooth check-in via Web Bluetooth API to verify onsite presence and prevent reselling
- [ ] Push notifications for last minute slot alerts
- [ ] AI-powered court suggestions when slots are full
- [ ] Full AI ballot system replacing first-come-first-serve
- [ ] Integration with OnePA and ActiveSG existing systems

---

## 📄 License

MIT © 2026 Team BookIt — JOM AI TAMPINES

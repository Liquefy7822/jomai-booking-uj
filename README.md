# 🏸 BookIt
### Smarter facility booking for Tampines residents

> Built for **JOM AI TAMPINES** by Team BookIt

🔗 **[Live Demo](https://v0-jomai-booking.vercel.app/)**

---

## 🚀 What is BookIt?

Booking a badminton court in Tampines shouldn't feel like a battle. BookIt is a modern facility booking platform that reduces booking friction, maximises shared usage of limited sports facilities, and makes the whole experience smoother — for everyone.

No more refreshing pages at midnight. No more empty courts that were "booked". No more going home because your court is full.

---

## 🆕 Latest Updates (May 2026)

### 🔧 **Build Fixes & Stability**
- ✅ **Fixed SSR Issues**: Resolved localStorage errors during server-side rendering
- ✅ **Type Safety**: Enhanced TypeScript support with proper null checks
- ✅ **Production Ready**: Successfully deployed to Vercel without build errors
- ✅ **Profile Management**: Fixed user profile picture and settings functionality

### 🚀 **Performance Improvements**
- Optimized static page generation for faster load times
- Improved error handling and user experience
- Enhanced mobile responsiveness across all pages

---

## ✨ Core Features

### 🗓️ **Smart Court Booking**
- **Browse & Filter**: View available courts by location, time, and amenities
- **Instant Booking**: Reserve slots in 3 clicks with real-time availability
- **Mobile First**: Perfect booking experience on any device
- **Court Details**: See photos, pricing, and facilities before booking

### 🤝 **Matchmaking System**
- **Share Your Court**: Toggle sharing to let others join your booking
- **Find Players**: Solo? Browse shared slots and join games instantly
- **Skill Matching**: Connect with players of similar skill levels
- **Community Building**: Meet new players in your neighborhood

### 👤 **User Profiles & Priority**
- **Priority Scoring**: Fair system based on booking history and reliability
- **Profile Customization**: Add photos and personal information
- **Booking History**: Track all your past and upcoming bookings
- **Achievement System**: Unlock perks as you build your reputation

### � **Smart Notifications**
- **Last-Minute Alerts**: Get notified when slots become available
- **Booking Reminders**: Never miss your scheduled court time
- **Matchmaking Updates**: Real-time alerts when players join your games

### 🛠️ **Admin Dashboard**
- **Court Management**: Add, edit, and manage court facilities
- **User Oversight**: Monitor user activity and resolve disputes
- **Analytics Dashboard**: Track usage patterns and peak times
- **System Settings**: Configure booking rules and priorities

### � **Security & Authentication**
- **Secure Login**: Password protection with session management
- **Multi-Device Support**: Stay logged in across all your devices
- **Data Privacy**: All user data stored securely with encryption
- **Admin Controls**: Role-based access for system management

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

# JomAI Booking System - Presentation Information

## Advantages Over ActiveSG

### Fairness & Transparency
- **Ballot-based allocation system** - Not first-come-first-served, ensuring fair access for all residents
- **Transparent scoring** - Users can see exactly how their ballot score is calculated and why they were/weren't selected
- **Public rankings** - Full transparency of ballot queue with scores and status visible to all users
- **Neighbourhood notification system** - Late cancellations notify the community, allowing others to claim released slots

### Smart Allocation Algorithm
- **Priority-based scoring** - Considers multiple factors: elderly priority, previous week selection, community contribution
- **Dynamic scoring** - Adjusts based on demand, user behavior, and fairness metrics
- **Elderly disadvantaged-access slots** - Weekend priority for elderly residents
- **Monthly override system** - Elderly can use one-time boost when playing with new partners

### User Experience
- **AI-powered ballot assistant** - Natural language interface to guide users through booking process
- **Smart suggestions** - Recommends optimal booking times based on user's priority score and history
- **Real-time updates** - Live ballot status and deadline tracking
- **Mobile-first design** - Progressive Web App capabilities with offline support

### Community Features
- **Matchmaking system** - Find players based on skill level and preferences
- **Credit score system** - Rewards good behavior (court cleanliness, on-time check-in, community contributions)
- **Credit history tracking** - Full transparency of how scores are gained/lost over time
- **Coach application system** - Community Centre-reviewed allocation for coaches

### Advanced Features
- **Bluetooth check-in** - Seamless court check-in using Bluetooth technology
- **Real-time notifications** - Push notifications for ballot results and booking reminders
- **Multi-language support** - English, Malay, Mandarin, Tamil
- **Singpass integration** - Secure government authentication

### Admin & Analytics
- **Comprehensive admin panel** - Full control over bookings, users, courts, and analytics
- **Anomaly detection** - AI-powered detection of suspicious booking patterns
- **Predictive analytics** - Forecast court demand and suggest optimal pricing
- **Detailed reporting** - Weekly/monthly usage summaries and fairness metrics

---

## Tech Stack

### Frontend Framework
- **Next.js 16.2.4** - React framework with server-side rendering and static site generation
- **React 19** - Latest React with concurrent features and improved performance
- **TypeScript 5.7.3** - Type-safe development with full IDE support

### UI Components & Styling
- **Radix UI** - Unstyled, accessible component primitives (30+ components)
- **Tailwind CSS 4.2.0** - Utility-first CSS framework with PostCSS integration
- **shadcn/ui** - Beautiful, accessible components built on Radix UI and Tailwind
- **Lucide React** - Consistent icon library with 1000+ icons
- **next-themes** - Dark mode support with system preference detection

### Forms & Validation
- **React Hook Form 7.54.1** - Performant form library with minimal re-renders
- **Zod 3.24.1** - TypeScript-first schema validation
- **@hookform/resolvers** - Integration between React Hook Form and Zod

### Data Visualization
- **Recharts 2.15.0** - Composable charting library for analytics dashboards
- **embla-carousel-react** - Customizable carousel for image galleries and sliders

### Date & Time
- **date-fns 4.1.0** - Modern date utility library
- **react-day-picker 9.13.2** - Flexible date picker component

### State Management
- **React Context API** - Built-in state management for user, booking, ballot, and admin contexts
- **Local Storage** - Client-side persistence for bookings, ballot entries, and user data

### Authentication
- **Singpass Integration** - Singapore's national digital identity system (planned)
- **Session Management** - Secure session handling with cleanup utilities

### Analytics & Monitoring
- **Vercel Analytics 1.6.1** - Performance monitoring and user analytics
- **Sentry** (planned) - Error tracking and performance monitoring

### Development Tools
- **ESLint** - Code linting and quality checks
- **PostCSS 8.5** - CSS transformation with autoprefixer
- **TypeScript Compiler** - Type checking and transpilation

---

## Key Features for Presentation

### 1. Ballot System
- **Problem**: First-come-first-served favors fast internet users, not fair allocation
- **Solution**: Weekly ballot with transparent scoring based on fairness metrics
- **Impact**: Ensures equal access regardless of technical skills or internet speed

### 2. Credit Score System
- **Problem**: No incentive for good behavior or community contribution
- **Solution**: Dynamic credit score that rewards/punishes user behavior
- **Impact**: Encourages court cleanliness, on-time check-ins, and community participation

### 3. AI-Powered Assistant
- **Problem**: Complex booking rules confuse users
- **Solution**: Natural language AI assistant explains rules and guides bookings
- **Impact**: Reduces user errors and improves booking success rate

### 4. Bluetooth Check-In
- **Problem**: Manual check-in is cumbersome and prone to errors
- **Solution**: Automatic Bluetooth-based court check-in
- **Impact**: Seamless user experience and accurate attendance tracking

### 5. Matchmaking System
- **Problem**: Solo players struggle to find partners
- **Solution**: Skill-based matchmaking with partner preferences
- **Impact**: Increases court utilization and community engagement

---

## Target Audience

### Primary Users
- **Residents** - Singapore residents looking to book badminton courts
- **Elderly Residents** - Disadvantaged-access priority for weekend slots
- **Coaches** - Professional coaches booking courts for training sessions

### Secondary Users
- **Community Centre Staff** - Review coach applications and manage allocations
- **Admin Staff** - Oversee system operations, handle disputes, view analytics

---

## Business Value

### For Users
- **Fair Access** - Equal opportunity regardless of technical skills
- **Transparency** - Full visibility into allocation process
- **Convenience** - AI assistant simplifies complex rules
- **Community** - Matchmaking and social features

### For Operators
- **Efficiency** - Automated allocation reduces manual work
- **Insights** - Analytics dashboard for data-driven decisions
- **Compliance** - Fair allocation meets regulatory requirements
- **Scalability** - System handles high demand periods

### For Community
- **Inclusivity** - Elderly and disadvantaged groups get priority
- **Engagement** - Credit system encourages positive behavior
- **Trust** - Transparency builds community confidence
- **Utilization** - Matchmaking maximizes court usage

---

## Future Roadmap Highlights

### Phase 1: AI Features (2-3 weeks)
- AI Ballot Assistant Modal
- 24/7 Support Chatbot
- Admin AI Anomaly Detection

### Phase 2: Mobile & Payments (3-4 weeks)
- Progressive Web App
- Stripe/PayLah Integration
- Push Notifications

### Phase 3: Advanced Analytics (4-6 weeks)
- Predictive Demand Forecasting
- Dynamic Pricing
- Computer Vision Check-In

---

## Metrics & KPIs

### User Engagement
- Ballot application completion rate
- Average time to complete booking
- User satisfaction score
- Return user rate

### System Performance
- Ballot allocation fairness index
- Court utilization rate
- Average wait time for slots
- System uptime

### Community Impact
- Elderly user adoption rate
- Community event participation
- Court cleanliness scores
- Positive behavior incidents

---

## Competitive Advantages

### vs ActiveSG
- **Fairer allocation** - Ballot system vs first-come-first-served
- **More transparent** - Public rankings vs opaque allocation
- **AI-powered** - Smart assistant vs manual navigation
- **Community-focused** - Credit system and matchmaking vs individual booking
- **Mobile-first** - PWA capabilities vs desktop-focused
- **Real-time** - Live updates vs delayed notifications

### Unique Selling Points
- Singapore-first design with Singpass integration
- Elderly disadvantaged-access slots
- Neighbourhood notification system
- Bluetooth check-in technology
- Multi-language support
- Community Centre coach integration

---

## Technical Highlights

### Performance
- Server-side rendering with Next.js
- Optimistic UI updates for instant feedback
- Lazy loading for code splitting
- Image optimization with Next.js Image component

### Security
- Type-safe development with TypeScript
- Input validation with Zod schemas
- Secure session management
- Singpass authentication integration

### Accessibility
- WCAG AA compliant components
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support

### Scalability
- Stateless architecture
- Database-ready design (PostgreSQL/Supabase ready)
- API-first approach
- Horizontal scaling capability

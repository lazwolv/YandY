# 💅 Y&Y Beauty Salon - Modern Booking & Management System

A comprehensive beauty salon booking system with social features, built with modern technologies.

## 🎨 Features

### Core Features
- 🗓️ **Appointment Booking** - Easy-to-use booking system with real-time availability
- 👥 **User Authentication** - Secure phone + password authentication with JWT
- 🌐 **Bilingual Support** - Full English and Spanish language switching
- 📱 **Progressive Web App** - Mobile-first design with PWA capabilities
- 💬 **SMS Notifications** - Twilio integration for appointment confirmations
- 🔐 **Role-based Access** - Customer, Employee, and Admin dashboards

### Social Features
- 📸 **Photo Gallery** - Customers can upload photos of their work
- ⭐ **Voting System** - Like and upvote favorite work
- 🏆 **Weekly Podium** - Top 3 most-voted works each week
- 💭 **Sentiment Analysis** - Feedback collection with sentiment scoring

### Advanced Features
- ⏰ **Flexible Scheduling** - Workers can manage their own availability
- 🚫 **Blocked Time Slots** - Workers can block specific time periods
- 🔄 **Real-time Updates** - Socket.io for live appointment updates
- 📊 **Admin Analytics** - Track appointments, feedback, and user engagement
- 🗄️ **Redis Caching** - Fast performance with Redis integration

## 🛠️ Tech Stack

### Backend
- **Node.js** + **TypeScript**
- **Express.js** - Web framework
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Database
- **Redis** - Caching and sessions
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Twilio** - SMS notifications
- **Zod** - Schema validation

### Frontend
- **React** 18 + **TypeScript**
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Zustand** - State management
- **React Hook Form** - Form handling
- **i18next** - Internationalization
- **Axios** - HTTP client

### DevOps
- **Docker** + **Docker Compose**
- **GitHub Actions** - CI/CD (coming soon)

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- Docker Desktop (running)
- PostgreSQL (default port 5432)
- Redis (optional, included in Docker)

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/yy-beauty-salon.git
cd yy-beauty-salon

# Install all dependencies
npm run install:all
```

### 2. Environment Setup

```bash
# Backend - copy and configure
cp backend/.env.example backend/.env

# Frontend - copy and configure
cp frontend/.env.example frontend/.env

# Update backend/.env with your credentials:
# - Database credentials
# - JWT secrets (use long random strings!)
# - Twilio credentials (if using SMS)
# - Redis password
```

### 3. Start Development

**Option A: Using Docker (Recommended)**
```bash
# Start all services (PostgreSQL, Redis, Backend, Frontend)
npm run dev:build

# Or without rebuilding
npm run dev

# Stop all services
npm run dev:down

# Clean up (removes volumes)
npm run dev:clean
```

**Option B: Local Development**
```bash
# Make sure PostgreSQL and Redis are running locally

# Terminal 1 - Backend
npm run backend:dev

# Terminal 2 - Frontend
npm run frontend:dev
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run backend:prisma:generate

# Run migrations
npm run backend:prisma:migrate

# (Optional) Open Prisma Studio to view/edit data
npm run backend:prisma:studio
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Health Check**: http://localhost:8000/health
- **Prisma Studio**: http://localhost:5555 (when running)

## 📂 Project Structure

```
Y&Y/
├── backend/              # TypeScript Backend
│   ├── src/
│   │   ├── config/      # Environment and database config
│   │   ├── controllers/ # Route handlers
│   │   ├── middleware/  # Auth, error handling
│   │   ├── routes/      # API routes
│   │   ├── utils/       # Helper functions
│   │   ├── app.ts       # Express app setup
│   │   └── server.ts    # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   ├── migrations/   # Migration files
│   │   └── seed.ts       # Seed data
│   └── package.json
│
├── frontend/             # React Frontend
│   ├── src/
│   │   ├── api/         # API client
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Zustand stores
│   │   ├── i18n/        # Translations
│   │   ├── styles/      # Global styles
│   │   └── App.tsx      # Root component
│   ├── public/
│   │   ├── images/      # Static assets
│   │   └── locales/     # Translation files
│   └── package.json
│
├── database/
│   └── init.sql         # PostgreSQL initialization
├── docker-compose.yml   # Docker services
├── .env.example         # Root env example
└── package.json         # Root scripts

```

## 🗄️ Database Schema

Key models:
- **User** - Authentication and profile
- **TeamMember** - Salon staff with availability
- **Service** - Available services with pricing
- **Appointment** - Booking records
- **Availability** - Staff weekly schedules
- **BlockedSlot** - Time-off management
- **WorkPhoto** - Customer photo uploads
- **PhotoVote** - Voting on work photos
- **WeeklyPodium** - Top 3 weekly winners
- **Feedback** - Customer feedback with sentiment
- **SmsSubscription** - Promotional SMS opt-in
- **Notification** - Multi-channel notifications

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get user profile

### Available Endpoints
- Services API (ready)
- Appointments API (ready)
- Availability API (ready)

### (Coming Soon)
- Photos & Voting
- Feedback
- Admin Analytics

## 🧪 Testing the Application

### 📱 Phone Number Authentication

The app uses **phone number + password** for registration and login:

**Customer Account:**
- Phone: `555-123-4567`
- Password: `customer123`

**Nail Tech Account:**
- Phone: `555-987-6543`
- Password: `employee123`

**Note:** You can enter phone numbers in any format (with or without dashes/spaces)

### 🔐 Protected Routes
- `/booking` - Requires login to book appointments
- `/dashboard` - Requires login to view dashboard
- Automatically redirects to login if not authenticated

### 📖 Documentation
- [PHONE_AUTH_UPDATE.md](./PHONE_AUTH_UPDATE.md) - Complete guide to phone authentication system
- [DASHBOARD_TESTING.md](./DASHBOARD_TESTING.md) - Dashboard testing guide with feature comparisons

### 📱 Installing as a Progressive Web App (PWA)

The Y&Y Beauty Salon website can be installed on your device for a native app-like experience!

**Benefits:**
- 🚀 Faster loading times with offline caching
- 📲 Add to home screen for quick access
- 🔔 Receive push notifications for appointments
- 💾 Works offline with cached content

#### On iPhone/iPad (iOS)

1. Open the website in **Safari** (must use Safari, not Chrome)
2. Tap the **Share** button (square with arrow pointing up) at the bottom
3. Scroll down and tap **"Add to Home Screen"**
4. Edit the name if desired, then tap **"Add"**
5. The app icon will appear on your home screen!

#### On Android

**Using Chrome:**
1. Open the website in **Chrome**
2. Tap the **menu** (three dots) in the top-right corner
3. Tap **"Install app"** or **"Add to Home screen"**
4. Follow the prompts to install
5. Launch from your home screen or app drawer!

**Alternative Method:**
- Look for the **"Install"** prompt banner that appears at the bottom of the screen
- Tap **"Install"** and confirm

#### On Desktop (Windows/Mac/Linux)

**Using Chrome or Edge:**
1. Visit the website
2. Look for the **install icon** (⊕) in the address bar on the right
3. Click it and select **"Install"**
4. The app will open in its own window
5. Access it from your start menu/applications folder!

**Alternative:**
- Click the **menu** (three dots)
- Select **"Install Y&Y Beauty Salon..."**
- Confirm the installation

#### Verifying PWA Features

Once installed, the app should:
- ✅ Load faster with cached content
- ✅ Work offline for previously visited pages
- ✅ Have its own app icon and window
- ✅ Look and feel like a native app

#### Uninstalling the PWA

**iOS:** Long-press the app icon → "Remove App" → "Delete App"

**Android:** Long-press the app icon → "Uninstall" or drag to "Uninstall"

**Desktop:** Right-click the app icon → "Uninstall"

## 🎯 Roadmap

### Phase 1: Core (Current)
- [x] Project setup and cleanup
- [x] Phone number authentication system
- [x] Protected routes (booking, dashboard)
- [x] Database schema with appointments
- [x] Customer dashboard
- [x] Employee dashboard with real appointments
- [x] Appointment confirmation status tracking
- [x] Test user accounts
- [ ] Appointment booking (frontend UI)
- [ ] Service selection (frontend UI)
- [ ] SMS confirmation integration

### Phase 2: Social Features
- [ ] Photo upload and gallery
- [ ] Voting system
- [ ] Weekly podium
- [ ] User points system

### Phase 3: Advanced
- [ ] Twilio SMS integration
- [ ] Sentiment analysis
- [ ] Real-time notifications
- [ ] Admin analytics dashboard
- [ ] n8n workflow automation

### Phase 4: Production
- [ ] Testing suite
- [ ] CI/CD pipeline
- [ ] Performance optimization
- [ ] Security audit
- [ ] Deployment

## 🔐 Security

- Passwords hashed with bcrypt
- JWT-based authentication with refresh tokens
- Environment variables for secrets
- CORS configuration
- Helmet.js security headers
- Input validation with Zod
- SQL injection protection via Prisma

## 🎨 Branding

**Colors:**
- Primary Purple: `#8d60a9`
- Purple Light: `#a67dbd`
- Purple Dark: `#6f4a87`

**Logo:** Located in `/frontend/public/images/LOGO-DEF-POS.png`

## 📝 Scripts Reference

```bash
# Docker
npm run dev              # Start all services
npm run dev:build        # Start with rebuild
npm run dev:down         # Stop services
npm run dev:clean        # Stop and remove volumes

# Backend
npm run backend:dev      # Start backend dev server
npm run backend:build    # Build backend
npm run backend:prisma:generate  # Generate Prisma client
npm run backend:prisma:migrate   # Run migrations
npm run backend:prisma:studio    # Open Prisma Studio

# Frontend
npm run frontend:dev     # Start frontend dev server
npm run frontend:build   # Build frontend for production

# Utilities
npm run install:all      # Install all dependencies
npm run clean           # Remove all node_modules and builds
```

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

MIT License - See LICENSE file for details

## 👤 Author

**Lazaro Martinez**

---

**Built with ❤️ for Y&Y Beauty Salon**

# Y&Y Beauty Salon

A full-stack beauty salon appointment booking system with SMS notifications, customer dashboards, and reward points.

## Features

- **Phone-Based Authentication**: SMS verification code login (no passwords needed)
- **Appointment Booking**: Schedule manicures, pedicures, hair services, and lash extensions
- **Customer Dashboard**: View upcoming and past appointments
- **Reward Points System**: Earn points for services
- **Responsive Design**: Mobile-first, works on all devices
- **SMS Notifications**: Appointment confirmations and reminders via Twilio (optional)

## Tech Stack

### Frontend
- **React 18** with **Vite** for fast development
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for state management

### Backend
- **Node.js** & **Express** REST API
- **MongoDB** with Mongoose ODM
- **Twilio** for SMS (optional)
- **bcryptjs** for secure data handling

## Project Structure

```
Y-Y-Beauty-Salon/
├── client/                 # React frontend
│   ├── public/
│   │   └── images/        # Salon, team, and work images
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components (Home, Login, Dashboard, etc.)
│   │   ├── services/      # API service layer
│   │   ├── contexts/      # React Context providers
│   │   └── App.jsx        # Main app component with routing
│   └── package.json
│
├── server/                # Express backend
│   ├── config/           # Database configuration
│   ├── models/           # Mongoose models (User, Appointment)
│   ├── services/         # Business logic (Twilio, etc.)
│   └── server.js         # Express server & API routes
│
├── client-backup/        # Backup of original HTML files
├── .env                  # Environment variables
└── package.json          # Root package.json
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Twilio account (optional, for SMS)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Y-Y-Beauty-Salon
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   Edit `.env` in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/yandy-beauty
   PORT=3000
   CLIENT_URL=http://localhost:5173

   # Optional: Twilio credentials for SMS
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```

   Edit `client/.env`:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Start MongoDB**

   Make sure MongoDB is running locally, or use MongoDB Atlas.

### Running the Application

#### Option 1: Run both servers concurrently (recommended)
```bash
npm run dev:full
```

#### Option 2: Run servers separately

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/request-verification` - Request SMS verification code
- `POST /api/auth/verify` - Verify code and login

### Appointments
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments/:userId` - Get user's appointments

## Development Notes

### Without Twilio
The app works perfectly fine without Twilio credentials. When Twilio is not configured:
- Verification codes are printed to the server console
- SMS notifications are skipped
- All other features work normally

### Database Schema

**User Model:**
- phoneNumber (unique)
- fullName (optional)
- isVerified
- points (reward system)
- role (client/employee/admin)
- favoriteTechnicians
- appointments

**Appointment Model:**
- client (User ref)
- technician (User ref)
- service
- startTime / endTime
- status (scheduled/confirmed/completed/cancelled/no-show)
- notes
- pointsEarned

## Planned Features

Based on `Features.txt`:

- [ ] PWA (Progressive Web App) functionality
- [ ] Worker availability management
- [ ] Social features (upload work, voting, weekly podium)
- [ ] Promotional text signup
- [ ] Sentiment analysis feedback box
- [ ] 3D character companion
- [ ] Multi-language support (EN/ES already started)

## Scripts

```bash
npm run start         # Start production server
npm run dev           # Start backend in development mode
npm run client        # Start React frontend
npm run dev:full      # Run both servers concurrently
npm run install:all   # Install all dependencies
```

## Contributing

This is a personal project for learning and portfolio purposes. Feel free to fork and modify!

## License

MIT

## Acknowledgments

- Y&Y Beauty Salon for the inspiration
- Built as a learning project to explore the MERN stack

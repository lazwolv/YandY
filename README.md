# Y&Y Beauty Salon - Quick Start (Solo Dev)

## 🎯 What You Need to Know

This is your beauty salon booking system. It's simple:
- **Backend**: Node.js API that handles bookings, auth, database
- **Frontend**: React website that customers see
- **Database**: PostgreSQL for data, Redis for caching

Everything runs in Docker - one command starts it all.

---

## 🚀 Start Development

```bash
# Start everything (backend + frontend + database)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

**That's it!** Open http://localhost:3000

---

## 📁 Project Structure

```
YandY/
├── backend/              # Node.js API (port 8000)
│   ├── src/              # Code goes here
│   ├── prisma/           # Database schema & migrations
│   └── .env.local        # Database connection (Docker)
│
├── frontend/             # React website (port 3000)
│   ├── src/              # Code goes here
│   └── .env.local        # API connection
│
├── docker-compose.yml    # Runs everything
└── .env.guide.md         # Environment variables explained
```

---

## 🔧 Common Tasks

### Make a database change
```bash
# 1. Edit backend/prisma/schema.prisma
# 2. Create migration
cd backend
npm run prisma:migrate

# 3. Restart backend
docker-compose restart backend
```

### See the database
```bash
cd backend
npm run prisma:studio
# Opens at http://localhost:5555
```

### Add a new feature
1. Backend code → `backend/src/controllers/`
2. Frontend code → `frontend/src/pages/` or `frontend/src/components/`
3. Restart: `docker-compose restart`

### Translate Spanish text
- Guide: `SPANISH_TRANSLATION_GUIDE.md`
- Translation keys: `frontend/src/contexts/LanguageContext.tsx`

---

## 🐛 Troubleshooting

**Frontend won't start?**
```bash
# Check backend is running
docker-compose ps

# Check frontend .env points to localhost
cat frontend/.env.local | grep VITE_API_URL
# Should say: http://localhost:8000
```

**Database won't connect?**
```bash
# Check database is running
docker-compose ps postgres

# Restart it
docker-compose restart postgres
```

**"Port already in use"?**
```bash
# Stop Docker
docker-compose down

# Kill processes on ports
# Windows:
taskkill /F /IM node.exe

# Then restart
docker-compose up -d
```

---

## 📚 Important Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Configures all services |
| `backend/prisma/schema.prisma` | Database structure |
| `backend/.env.local` | Database connection |
| `frontend/.env.local` | API connection |
| `.env.guide.md` | Environment variables explained |
| `SPANISH_TRANSLATION_GUIDE.md` | How to add Spanish text |

---

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Database UI**: http://localhost:5555 (run `npm run prisma:studio` first)

---

## 📝 Notes

- **Production**: Deployed on Render (environment vars set there)
- **Git**: `.gitignore` protects secrets - safe to commit
- **Solo dev**: No CI/CD, no team workflows - just you and Docker
- **Auth**: Phone number + password (no SMS in dev mode)

---

## 🆘 Need Help?

1. Check `.env.guide.md` for environment variable issues
2. Check `docker-compose logs -f` for errors
3. Restart everything: `docker-compose restart`
4. Nuclear option: `docker-compose down && docker-compose up -d`

---

**Most common fix**: Restart Docker and clear browser cache! 🔄

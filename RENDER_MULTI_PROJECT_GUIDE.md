# Render Multi-Project Deployment Guide

**Strategy:** Shared Infrastructure for Cost Optimization
**Best For:** 2-5 projects that don't need dedicated database instances
**Savings:** ~40-60% compared to separate infrastructure per project

---

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────────────┐
│         Shared Infrastructure ($17/mo)          │
├─────────────────────────────────────────────────┤
│  PostgreSQL Starter ($7/mo)                     │
│    ├── yandy_db (YandY Beauty Salon)            │
│    ├── project2_db                              │
│    └── project3_db                              │
│                                                  │
│  Redis Starter ($10/mo)                         │
│    ├── yandy:* keys                             │
│    ├── project2:* keys                          │
│    └── project3:* keys                          │
└─────────────────────────────────────────────────┘
           │                │
    ┌──────┴─────┐   ┌─────┴──────┐
    │  Project 1  │   │  Project 2  │  ($7/mo each)
    │   Backend   │   │   Backend   │
    └─────────────┘   └─────────────┘
           │                │
    ┌──────┴─────┐   ┌─────┴──────┐
    │  Project 1  │   │  Project 2  │  (Free)
    │  Frontend   │   │  Frontend   │
    └─────────────┘   └─────────────┘
```

---

## 📋 Step-by-Step Setup

### Phase 1: Create Shared Infrastructure (One Time)

#### 1. Create Shared PostgreSQL Database

1. **Create Database**
   - Render Dashboard → "New +" → "PostgreSQL"
   - Name: `shared-production-db`
   - Region: Oregon (or closest to your users)
   - Plan: **Starter ($7/month)**

2. **Save Connection Details**
   ```
   Internal Database URL: postgresql://user:pass@host/dbname
   ```

3. **Create Separate Databases for Each Project**

   After PostgreSQL is created:
   - Go to database → "Shell" tab
   - Run these commands:

   ```sql
   -- Create database for YandY
   CREATE DATABASE yandy_db;

   -- Create database for project 2
   CREATE DATABASE project2_db;

   -- Create database for project 3 (when needed)
   CREATE DATABASE project3_db;

   -- Verify
   \l
   ```

4. **Generate Connection URLs for Each Project**

   Base URL format:
   ```
   postgresql://user:password@host:port/yandy_db
   postgresql://user:password@host:port/project2_db
   postgresql://user:password@host:port/project3_db
   ```

   **Important:** Only change the database name at the end!

#### 2. Create Shared Redis Instance

1. **Create Redis**
   - Dashboard → "New +" → "Redis"
   - Name: `shared-production-redis`
   - Region: Same as PostgreSQL
   - Plan: **Starter ($10/month, 256MB)**

2. **Save Connection URL**
   ```
   Internal Redis URL: redis://default:pass@host:port
   ```

3. **Use Key Prefixes to Separate Projects**

   In your apps, use prefixes:
   - YandY: `yandy:session:123`, `yandy:cache:xyz`
   - Project 2: `proj2:session:123`, `proj2:cache:xyz`

   This keeps data isolated in shared Redis.

---

### Phase 2: Deploy Projects Using Shared Infrastructure

#### Project 1: YandY Beauty Salon

**Backend Service:**
1. Dashboard → "New +" → "Web Service"
2. Connect repo: `lazwolv/YandY`
3. Name: `yandy-backend`
4. Root Directory: `backend`
5. Build Command: `npm install && npx prisma generate && npm run build`
6. Start Command: `npm start`

**Environment Variables:**
```env
# Use yandy_db from shared PostgreSQL
DATABASE_URL=postgresql://user:pass@shared-host:5432/yandy_db

# Use shared Redis with yandy: prefix
REDIS_URL=redis://default:pass@shared-host:6379
REDIS_PREFIX=yandy:

# App config
NODE_ENV=production
PORT=8000
JWT_SECRET=<your-secret>
JWT_REFRESH_SECRET=<your-secret>
FRONTEND_URL=https://yandybeautysalon.com
CORS_ORIGIN=https://yandybeautysalon.com
```

**Frontend Static Site:**
1. Dashboard → "New +" → "Static Site"
2. Connect repo: `lazwolv/YandY`
3. Name: `yandy-frontend`
4. Root Directory: `frontend`
5. Build Command: `npm install && npm run build`
6. Publish Directory: `dist`

**Environment Variables:**
```env
VITE_API_URL=https://yandy-backend.onrender.com
```

#### Project 2: Your Next App

**Backend Service:**
```env
# Use project2_db from shared PostgreSQL
DATABASE_URL=postgresql://user:pass@shared-host:5432/project2_db

# Use shared Redis with project2: prefix
REDIS_URL=redis://default:pass@shared-host:6379
REDIS_PREFIX=project2:

# Rest of your config...
```

**Same process for frontend...**

---

### Phase 3: Database Migrations per Project

**Important:** Run migrations for each database separately!

#### For YandY:
```bash
# In YandY backend Shell on Render
export DATABASE_URL="postgresql://user:pass@host/yandy_db"
npx prisma migrate deploy
npx prisma db seed  # optional
```

#### For Project 2:
```bash
# In Project 2 backend Shell on Render
export DATABASE_URL="postgresql://user:pass@host/project2_db"
npx prisma migrate deploy
```

---

## 🔒 Security & Isolation

### Database Isolation
✅ **Fully isolated** - Each project has its own database
✅ No cross-contamination possible
✅ Easy to backup/restore per project

### Redis Isolation
⚠️ **Shared instance, use prefixes**
✅ Use key prefixes (`yandy:`, `project2:`)
✅ In code: `redis.set('yandy:session:123', data)`
✅ Low risk - session/cache data is temporary

### When to Upgrade to Separate Instances

Upgrade to separate databases/Redis when:
- **Database:** One project exceeds 1GB storage (Starter limit)
- **Redis:** One project needs >100MB cache (monitor in dashboard)
- **Performance:** Database queries slow (check metrics)
- **Compliance:** Legal/client requires dedicated infrastructure

---

## 📊 Cost Scaling Guide

### 2 Projects
- Shared infra: $17
- Backends (2 × $7): $14
- **Total: $31/month**
- vs Separate: $48/month
- **Savings: $17/month ($204/year)**

### 3 Projects
- Shared infra: $17
- Backends (3 × $7): $21
- **Total: $38/month**
- vs Separate: $72/month
- **Savings: $34/month ($408/year)**

### 5 Projects
- Shared infra: $17
- Backends (5 × $7): $35
- **Total: $52/month**
- vs Separate: $120/month
- **Savings: $68/month ($816/year)**

### When to Split Infrastructure

If any single project needs:
- More than 1GB database storage → Get dedicated PostgreSQL
- More than 100MB Redis → Get dedicated Redis
- High traffic causing slowdowns → Separate everything

---

## 🚀 Deployment Workflow

### Adding a New Project (5 minutes)

1. **Create new database** in shared PostgreSQL:
   ```sql
   CREATE DATABASE newproject_db;
   ```

2. **Deploy backend service** with:
   ```env
   DATABASE_URL=postgresql://...shared-host.../newproject_db
   REDIS_URL=redis://...shared-redis...
   REDIS_PREFIX=newproject:
   ```

3. **Deploy frontend static site**

4. **Run migrations** in backend shell

Done! New project live for only +$7/month.

---

## 📈 Monitoring & Maintenance

### What to Monitor

1. **PostgreSQL Dashboard:**
   - Storage usage (max 1GB on Starter)
   - Connection count (max 22 on Starter)
   - Query performance

2. **Redis Dashboard:**
   - Memory usage (max 256MB on Starter)
   - Hit rate
   - Key count per prefix

3. **Backend Services:**
   - Response times
   - Error rates
   - CPU/Memory usage

### Upgrade Triggers

**PostgreSQL:**
- Storage >80% → Upgrade to Standard ($20/month, 10GB)
- Connections maxing out → Upgrade or optimize queries
- Slow queries → Add indexes or upgrade

**Redis:**
- Memory >80% → Upgrade to Standard ($25/month, 1GB)
- High eviction rate → Need more memory

**Backend:**
- Consistent high CPU → Upgrade to Standard ($25/month)
- Slow response times → Scale up

---

## 🆘 Troubleshooting

### "Too many connections" Error
**Problem:** PostgreSQL Starter has 22 connection limit
**Solutions:**
1. Reduce connection pool size in each app:
   ```javascript
   // In Prisma datasource
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     connection_limit = 5  // Per app
   }
   ```
2. Upgrade to Standard (97 connections)

### Redis Memory Full
**Problem:** Hitting 256MB limit
**Solutions:**
1. Set expiration on all keys:
   ```javascript
   redis.setex('yandy:cache:key', 3600, data); // 1 hour
   ```
2. Clear old keys per project:
   ```bash
   redis-cli --scan --pattern "yandy:*" | xargs redis-cli del
   ```
3. Upgrade to Standard (1GB)

### Database Conflicts
**Problem:** Migrations failing
**Solution:** Always specify full DATABASE_URL with correct database name

---

## 🎯 Best Practices

### ✅ DO:
- Use separate databases per project
- Use Redis key prefixes consistently
- Monitor resource usage monthly
- Set connection limits per app
- Set TTL on all Redis keys
- Keep backups (Render does daily backups on paid plans)

### ❌ DON'T:
- Share the same database between projects
- Forget Redis prefixes (causes key collisions)
- Ignore storage/memory warnings
- Use default connection pool sizes
- Store permanent data in Redis

---

## 🔄 Migration from Separate to Shared

If you already have separate databases:

1. **Backup each database:**
   ```bash
   pg_dump old_db > yandy_backup.sql
   ```

2. **Create new database in shared instance:**
   ```sql
   CREATE DATABASE yandy_db;
   ```

3. **Restore backup:**
   ```bash
   psql yandy_db < yandy_backup.sql
   ```

4. **Update env vars** to point to new shared instance

5. **Test thoroughly** before deleting old instance

6. **Delete old separate instances** to stop billing

---

## 💡 Alternative Patterns

### Pattern A: Shared PostgreSQL, Separate Redis
**When:** One project needs heavy caching
**Cost:** $7 (shared PG) + $10 (Redis 1) + $10 (Redis 2) + backends

### Pattern B: Shared Redis, Separate PostgreSQL
**When:** Compliance requires isolated databases
**Cost:** $10 (shared Redis) + $7 (PG 1) + $7 (PG 2) + backends

### Pattern C: Everything Separate
**When:** Production apps with strict SLAs
**Cost:** Full $24/project but maximum isolation

---

## 📞 When to Ask for Help

- Database storage consistently >80%
- Redis memory >80%
- Connection errors despite tuning
- Slow queries across multiple projects
- Planning to go beyond 5 projects

At that scale, consider:
- Professional tier ($70/month but better performance)
- Managed services (AWS RDS, ElastiCache)
- Dedicated infrastructure

---

## Summary

**Shared infrastructure on Render is perfect when:**
- ✅ You have 2-5 small-to-medium projects
- ✅ Total storage <1GB across all projects
- ✅ Total Redis usage <256MB
- ✅ Want managed services without complexity
- ✅ Focus on building, not infrastructure

**Save 40-60% on infrastructure costs while keeping all the benefits of Render's managed platform.**

---

**Questions?** Check Render docs: https://render.com/docs

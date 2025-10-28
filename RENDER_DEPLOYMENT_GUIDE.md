# YandY Beauty Salon - Render Deployment Guide

**Domain:** yandybeautysalon.com
**Platform:** Render.com
**Last Updated:** 2025-10-26

---

## Prerequisites

- [x] GitHub repository: https://github.com/lazwolv/YandY
- [x] Custom domain: yandybeautysalon.com (Squarespace)
- [x] Render account (free tier available)
- [ ] Twilio account for SMS (optional, can add later)

---

## 📋 Deployment Checklist

### Phase 1: Render Account Setup (5 minutes)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub (recommended - easier integration)
   - Verify email

2. **Connect GitHub Repository**
   - Dashboard → "New" → Select repository access
   - Grant access to `lazwolv/YandY` repository

---

### Phase 2: Database Setup (10 minutes)

#### Step 1: Create PostgreSQL Database

1. **Create Database**
   - Dashboard → "New +" → "PostgreSQL"
   - Name: `yandy-production-db`
   - Database: `yy_beauty_salon`
   - User: `salon_admin`
   - Region: Choose closest to your users (e.g., Oregon USA)
   - Instance Type: **Free** (for testing) or **Starter** ($7/month for production)

2. **Save Connection Details**
   - After creation, click into the database
   - Copy "Internal Database URL" (starts with `postgresql://`)
   - Save this - you'll need it for backend env vars

#### Step 2: Create Redis Instance

1. **Create Redis**
   - Dashboard → "New +" → "Redis"
   - Name: `yandy-production-redis`
   - Region: Same as PostgreSQL
   - Plan: **Free** (25 MB) or **Starter** ($10/month for 256MB)

2. **Save Connection Details**
   - Copy "Internal Redis URL" (starts with `redis://`)
   - Save this for backend env vars

---

### Phase 3: Backend Deployment (15 minutes)

1. **Create Backend Web Service**
   - Dashboard → "New +" → "Web Service"
   - Connect Repository: `lazwolv/YandY`
   - Name: `yandy-backend`
   - Region: Same as databases
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: **Node**
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`
   - Instance Type: **Free** (testing) or **Starter** ($7/month)

2. **Configure Environment Variables**

   Click "Advanced" → "Add Environment Variable" for each:

   ```env
   # Database (use Internal Database URL from Step 2.1)
   DATABASE_URL=<your-postgres-internal-url>

   # Redis (use Internal Redis URL from Step 2.2)
   REDIS_URL=<your-redis-internal-url>

   # Server Config
   NODE_ENV=production
   PORT=8000

   # JWT Secrets (GENERATE NEW ONES!)
   # Use: openssl rand -hex 64
   JWT_SECRET=<generate-64-character-hex-string>
   JWT_REFRESH_SECRET=<generate-different-64-character-hex-string>
   JWT_ACCESS_EXPIRY=15m
   JWT_REFRESH_EXPIRY=7d

   # Frontend URL (will update after frontend deployment)
   FRONTEND_URL=https://yandybeautysalon.com

   # CORS
   CORS_ORIGIN=https://yandybeautysalon.com

   # Twilio (optional - can add later)
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

3. **Deploy Backend**
   - Click "Create Web Service"
   - Wait for build to complete (5-10 minutes)
   - Check logs for any errors

4. **Run Database Migrations**

   After successful deployment:
   - Go to backend service → "Shell" tab
   - Run: `npx prisma migrate deploy`
   - Run: `npx prisma db seed` (optional - adds sample services)

5. **Test Backend**
   - Copy backend URL (e.g., `https://yandy-backend.onrender.com`)
   - Visit: `https://yandy-backend.onrender.com/health`
   - Should see: `{"status":"ok","timestamp":"..."}`

---

### Phase 4: Frontend Deployment (10 minutes)

1. **Create Frontend Static Site**
   - Dashboard → "New +" → "Static Site"
   - Connect Repository: `lazwolv/YandY`
   - Name: `yandy-frontend`
   - Branch: `main`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

2. **Configure Environment Variables**

   Add environment variable:
   ```env
   VITE_API_URL=https://yandy-backend.onrender.com
   ```

   **Important:** Replace with your actual backend URL from Phase 3, step 5

3. **Deploy Frontend**
   - Click "Create Static Site"
   - Wait for build (3-5 minutes)
   - You'll get a temporary URL like `https://yandy-frontend.onrender.com`

4. **Update Backend CORS**
   - Go back to backend service
   - Update `FRONTEND_URL` to the temporary frontend URL
   - Service will auto-redeploy

---

### Phase 5: Custom Domain Setup (15 minutes)

#### Step 1: Configure Render

1. **Add Custom Domain to Frontend**
   - Go to frontend service
   - Settings → "Custom Domain"
   - Add domain: `yandybeautysalon.com`
   - Add domain: `www.yandybeautysalon.com` (recommended)

2. **Note DNS Records**

   Render will show you DNS records to add:
   ```
   Type: CNAME
   Name: www
   Value: yandy-frontend.onrender.com

   Type: A (or ALIAS if supported)
   Name: @ (root domain)
   Value: <Render's IP address>
   ```

#### Step 2: Update Squarespace DNS

1. **Access Squarespace DNS Settings**
   - Log into Squarespace
   - Settings → Domains → yandybeautysalon.com
   - Advanced Settings → DNS Settings

2. **Add DNS Records**

   **For www subdomain:**
   - Click "Add Record"
   - Type: CNAME
   - Host: `www`
   - Data: `yandy-frontend.onrender.com`
   - TTL: 3600

   **For root domain:**
   - Type: A Record
   - Host: `@`
   - Data: `<Render's IP address from Step 1>`
   - TTL: 3600

3. **Wait for DNS Propagation**
   - Can take 5 minutes to 48 hours
   - Usually works within 15-30 minutes
   - Check status: https://www.whatsmydns.net

#### Step 3: Enable SSL (Automatic)

- Render automatically provisions SSL certificates
- After DNS propagates, SSL will activate (5-10 minutes)
- Your site will be available at https://yandybeautysalon.com

#### Step 4: Update Backend Environment

1. **Update Backend Service**
   - Go to backend service → Environment
   - Update these variables:
   ```env
   FRONTEND_URL=https://yandybeautysalon.com
   CORS_ORIGIN=https://yandybeautysalon.com
   ```
   - Service will auto-redeploy

---

### Phase 6: Final Testing (10 minutes)

1. **Test Frontend**
   - Visit: https://yandybeautysalon.com
   - Should load the home page

2. **Test Backend Connection**
   - Try to register a new account
   - Try to log in
   - Check browser console for any CORS errors

3. **Test Features**
   - [ ] User registration
   - [ ] User login
   - [ ] View services
   - [ ] Book appointment
   - [ ] Dashboard access

4. **Monitor Logs**
   - Backend: Check for errors in Render dashboard
   - Frontend: Check browser console

---

## 🔒 Security Checklist

- [ ] JWT secrets are strong and unique (64+ characters)
- [ ] Database password is strong
- [ ] Redis password is set (if not using free tier)
- [ ] CORS is properly configured
- [ ] SSL/HTTPS is enabled
- [ ] Environment variables are set correctly
- [ ] No secrets in git repository (already verified ✅)

---

## 💰 Render Pricing Estimate

### Free Tier (Good for testing)
- PostgreSQL: Free (expires after 90 days)
- Redis: Free (25 MB)
- Backend: Free (spins down after 15 min inactivity)
- Frontend: Free (100 GB bandwidth/month)
- **Total: $0/month**

### Starter Production Setup (Recommended)
- PostgreSQL Starter: $7/month (256MB RAM, 1GB storage)
- Redis Starter: $10/month (256MB RAM)
- Backend Starter: $7/month (512MB RAM)
- Frontend: Free
- **Total: $24/month**

### Professional Setup
- PostgreSQL Standard: $20/month (1GB RAM, 10GB storage)
- Redis Standard: $25/month (1GB RAM)
- Backend Standard: $25/month (2GB RAM)
- Frontend: Free
- **Total: $70/month**

---

## 🚀 Post-Deployment

### Monitor Your Application

1. **Set Up Monitoring**
   - Render provides basic monitoring in dashboard
   - Consider adding Sentry for error tracking
   - Set up uptime monitoring (e.g., UptimeRobot)

2. **Set Up Backups**
   - Render backs up databases daily (paid plans)
   - Consider manual backups for critical data

3. **Performance Optimization**
   - Monitor response times in Render dashboard
   - Scale up if needed (upgrade instance types)

### Maintenance

- **Update Dependencies:** Run `npm update` periodically
- **Security Updates:** Watch for security advisories
- **Database Maintenance:** Monitor database size and performance
- **Log Monitoring:** Check logs regularly for errors

---

## 🆘 Troubleshooting

### Backend Won't Start
1. Check environment variables are set correctly
2. Verify DATABASE_URL is correct
3. Check build logs for errors
4. Make sure migrations ran: `npx prisma migrate deploy`

### Frontend Shows API Errors
1. Verify VITE_API_URL points to backend
2. Check CORS settings on backend
3. Verify backend is running and accessible
4. Check browser console for specific errors

### Database Connection Errors
1. Use Internal Database URL (not External)
2. Verify database is running
3. Check if migrations were applied
4. Verify Prisma schema matches database

### Domain Not Working
1. Wait for DNS propagation (up to 48 hours)
2. Verify DNS records in Squarespace
3. Check DNS propagation: https://www.whatsmydns.net
4. Make sure CNAME points to correct Render URL

---

## 📞 Support

- **Render Docs:** https://render.com/docs
- **Render Community:** https://community.render.com
- **Your GitHub:** https://github.com/lazwolv/YandY
- **Project Documentation:** PROJECT_DOCUMENTATION.md (local)

---

## Next Steps After Deployment

1. **Configure Twilio** (for SMS notifications)
2. **Set up email service** (for email notifications)
3. **Add analytics** (Google Analytics, etc.)
4. **Set up monitoring** (Sentry, LogRocket)
5. **Create admin account** via backend shell
6. **Seed services data** if not done already
7. **Test payment integration** (if applicable)

---

Good luck with your deployment! 🚀

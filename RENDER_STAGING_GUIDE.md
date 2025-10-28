# Private Staging Deployment on Render

**Goal:** Deploy YandY privately for testing before customers see it
**Best For:** Testing database, API connections, and production environment without public access

---

## 🎯 Strategy Options

### **Option 1: Password Protection (Recommended - Easiest)**

Deploy normally but add basic authentication to block access.

**Pros:**
- ✅ Simple to implement
- ✅ Test real production environment
- ✅ No extra costs
- ✅ Easy to remove when ready to launch

**Cons:**
- ⚠️ Basic security (fine for staging)
- ⚠️ Requires login before accessing site

---

### **Option 2: Private Branch Deployment**

Use a separate `staging` branch that deploys to different URLs.

**Pros:**
- ✅ Separate from production
- ✅ Test before merging to main
- ✅ Can have different env variables

**Cons:**
- ⚠️ Still publicly accessible (combine with Option 1)

---

### **Option 3: Environment Variables Feature Flags**

Use feature flags to hide incomplete features in production.

**Pros:**
- ✅ Already implemented in your .env!
- ✅ Granular control
- ✅ Can enable features gradually

**Cons:**
- ⚠️ Site is still public
- ⚠️ Features are just hidden, not protected

---

## 🔐 Recommended Approach: Password + Feature Flags

**Best of all worlds:**
1. Deploy with basic auth password
2. Use feature flags to control what's visible
3. Test everything in production environment
4. Remove password when ready to launch

---

## 📋 Implementation Guide

### Step 1: Add Basic Auth Middleware to Backend

This will password-protect your entire site during staging.

**1. Install basic-auth package**

```bash
cd backend
npm install basic-auth
```

**2. Create middleware file**

`backend/src/middleware/stagingAuth.ts`:

```typescript
import auth from 'basic-auth';
import { Request, Response, NextFunction } from 'express';

/**
 * Basic Authentication Middleware for Staging
 * Set STAGING_PASSWORD in env to enable
 */
export const stagingAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Only enable if STAGING_PASSWORD is set
  const stagingPassword = process.env.STAGING_PASSWORD;

  if (!stagingPassword) {
    // No password set, allow access
    return next();
  }

  // Skip auth for health check endpoint
  if (req.path === '/health' || req.path === '/api/health') {
    return next();
  }

  const credentials = auth(req);

  // Check credentials
  if (
    !credentials ||
    credentials.name !== 'admin' ||
    credentials.pass !== stagingPassword
  ) {
    res.setHeader('WWW-Authenticate', 'Basic realm="YandY Staging"');
    return res.status(401).json({
      error: 'Access denied',
      message: 'Please enter staging credentials',
    });
  }

  next();
};
```

**3. Add to your Express app**

In `backend/src/app.ts` (before your routes):

```typescript
import { stagingAuthMiddleware } from './middleware/stagingAuth';

// ... other imports

const app = express();

// Add staging auth as early as possible
app.use(stagingAuthMiddleware);

// ... rest of your middleware and routes
```

**4. Add environment variable**

In `backend/.env`:

```env
# Staging Protection
# Set a password to enable basic auth on the entire site
# Remove or leave empty to disable
STAGING_PASSWORD=YourSecureStaging123!
```

---

### Step 2: Deploy to Render with Staging Protection

**1. Create Backend Service**

Follow your normal `RENDER_DEPLOYMENT_GUIDE.md`, but add this env variable:

```env
STAGING_PASSWORD=YourSecureStaging123!
```

**2. Deploy Frontend**

Frontend doesn't need changes - the browser will automatically prompt for password when accessing the backend.

**3. Test Access**

When you visit your site:
1. Browser will show login prompt
2. Username: `admin`
3. Password: `YourSecureStaging123!` (or whatever you set)
4. After login, you can test everything

---

### Step 3: Test Production Environment

**What to test:**

- [ ] **Login/Signup** - Most important! Backend connection is working
- [ ] **Database** - All queries work
- [ ] **Appointments** - Can create/view appointments
- [ ] **Environment Variables** - Contact info displays correctly
- [ ] **Social Links** - Instagram/Facebook links work
- [ ] **Phone/Email Links** - Click to call/email works
- [ ] **Google Maps** - Directions button works
- [ ] **Performance** - Site loads fast
- [ ] **Mobile** - Test on phone
- [ ] **SSL** - https:// works with green lock

---

### Step 4: Launch Publicly

When ready to launch:

**Option A: Remove Password (Full Public Launch)**

1. Go to Render backend service
2. Environment → Remove `STAGING_PASSWORD` variable
3. Service will redeploy automatically
4. Site is now public! 🎉

**Option B: Gradual Launch with Feature Flags**

1. Remove staging password
2. Keep some features disabled via .env:
   ```env
   VITE_FEATURE_NEWSLETTER=false
   VITE_FEATURE_GALLERY_VOTING=false
   ```
3. Enable features as you finish them

---

## 🔄 Alternative: Staging Branch Strategy

If you want a separate staging environment:

### 1. Create Staging Branch

```bash
git checkout -b staging
git push origin staging
```

### 2. Deploy Staging Backend on Render

- Name: `yandy-backend-staging`
- Branch: `staging`
- Env vars: Same as production + `STAGING_PASSWORD`
- URL: `https://yandy-backend-staging.onrender.com`

### 3. Deploy Staging Frontend

- Name: `yandy-frontend-staging`
- Branch: `staging`
- Env var: `VITE_API_URL=https://yandy-backend-staging.onrender.com`
- URL: `https://yandy-staging.onrender.com`

### 4. Workflow

```bash
# Work on features in staging
git checkout staging
# ... make changes
git commit -m "New feature"
git push origin staging

# When ready, merge to main for production
git checkout main
git merge staging
git push origin main
```

**Cost:**
- Staging backend: $7/month (or free with spin-down)
- Staging frontend: Free
- Can share same database/Redis

---

## 🎯 Feature Flags Usage

You already have feature flags set up! Use them to control visibility:

### In Production .env on Render

```env
# Enable/disable features without redeploying code
VITE_FEATURE_BOOKING=true         # Booking works, show it
VITE_FEATURE_NEWSLETTER=false     # Not ready, hide it
VITE_FEATURE_GALLERY_VOTING=false # Coming soon, hide it

# Show beta badge to indicate testing phase
VITE_SHOW_BETA_BADGE=true
```

### Maintenance Mode

If you need to take site down temporarily:

```env
VITE_MAINTENANCE_MODE=true
```

Then create a simple check in your app:

`frontend/src/App.tsx`:

```typescript
import { env } from './config/env';

function App() {
  if (env.maintenanceMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Under Maintenance</h1>
          <p>We'll be back soon! Check back in a few hours.</p>
        </div>
      </div>
    );
  }

  return (
    // ... your normal app
  );
}
```

---

## 📊 Comparison: Which Strategy?

| Strategy | Privacy | Cost | Ease | Best For |
|----------|---------|------|------|----------|
| **Password Protection** | ✅ High | Free | ⭐⭐⭐ Easy | Testing before launch |
| **Staging Branch** | ⚠️ Public | $7/mo | ⭐⭐ Medium | Long-term staging |
| **Feature Flags** | ❌ Public | Free | ⭐⭐⭐ Easy | Gradual rollout |
| **Password + Flags** | ✅ High | Free | ⭐⭐⭐ Easy | **Recommended!** |

---

## 🚀 Recommended Deployment Flow

### Phase 1: Private Testing (Days 1-7)

```env
# Backend
STAGING_PASSWORD=SecurePassword123!

# Frontend
VITE_API_URL=https://yandy-backend.onrender.com
VITE_FEATURE_BOOKING=true
VITE_FEATURE_NEWSLETTER=false
VITE_SHOW_BETA_BADGE=true
```

**Actions:**
- Deploy with password protection
- Test all features thoroughly
- Fix any bugs
- Verify database works
- Test on mobile

### Phase 2: Soft Launch (Days 8-14)

```env
# Backend
# Remove STAGING_PASSWORD (or leave empty)

# Frontend
VITE_API_URL=https://yandy-backend.onrender.com
VITE_FEATURE_BOOKING=true
VITE_FEATURE_NEWSLETTER=false
VITE_SHOW_BETA_BADGE=true  # Shows "Beta" badge
```

**Actions:**
- Remove password
- Share with friends/family
- Get initial feedback
- Monitor for errors
- Keep beta badge visible

### Phase 3: Public Launch (Day 15+)

```env
# Frontend
VITE_API_URL=https://yandy-backend.onrender.com
VITE_FEATURE_BOOKING=true
VITE_FEATURE_NEWSLETTER=true  # If ready
VITE_SHOW_BETA_BADGE=false    # Remove beta badge
```

**Actions:**
- Full public launch
- Enable all ready features
- Start marketing
- Monitor performance
- Scale as needed

---

## 🆘 Troubleshooting

### "Can't access staging site"

**Problem:** Browser keeps asking for password
**Solution:**
- Check STAGING_PASSWORD is set in Render backend env
- Try clearing browser cache
- Try incognito mode

### "Login still fails on staging"

**Problem:** Frontend can't reach backend
**Solution:**
- Check `VITE_API_URL` in frontend env on Render
- Check `CORS_ORIGIN` in backend allows frontend URL
- Check browser console for CORS errors

### "Want to test without password for specific people"

**Solution:** Share credentials or use IP whitelist:

```typescript
// In stagingAuth middleware
const allowedIPs = process.env.STAGING_ALLOWED_IPS?.split(',') || [];
const clientIP = req.ip;

if (allowedIPs.includes(clientIP)) {
  return next(); // Skip password for whitelisted IPs
}
```

Then in Render:
```env
STAGING_ALLOWED_IPS=123.45.67.89,98.76.54.32
```

---

## 📝 Summary

**For your situation (testing before customers see it):**

1. ✅ **Use Option 1: Password Protection**
   - Easiest to implement
   - Test real production environment
   - Free
   - Remove password when ready

2. ✅ **Add feature flags** (already done!)
   - Control what's visible
   - Launch features gradually

3. ✅ **Test checklist:**
   - Login/signup works ← **Most critical!**
   - All buttons work
   - Contact info correct
   - Mobile responsive
   - Fast loading

4. ✅ **Launch when ready:**
   - Remove `STAGING_PASSWORD`
   - Update `VITE_API_URL` if needed
   - Enable all features
   - Announce! 🎉

---

**Questions?** Check main deployment guide: `RENDER_DEPLOYMENT_GUIDE.md`

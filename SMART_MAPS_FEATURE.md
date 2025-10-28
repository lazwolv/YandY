# Smart Maps Feature - Device-Specific Directions

**What:** Automatically opens the native maps app based on the user's device
**Why:** Better UX - users want their familiar maps app, not always Google Maps website

---

## 🗺️ How It Works

### Before (Static):
- Everyone gets Google Maps website URL
- iPhone users want Apple Maps
- Android users might prefer Google Maps app
- Not optimal UX

### After (Smart):
- **iPhone/iPad** → Opens Apple Maps app
- **Android** → Opens Google Maps app
- **Desktop** → Opens Google Maps website

---

## 🎯 Implementation

### 1. Created Smart Maps Utility

**File:** `frontend/src/utils/maps.ts`

**Functions:**
- `getDeviceType()` - Detects if user is on iOS, Android, or desktop
- `getMapsUrl()` - Generates the correct URL for that device
- `openMaps()` - Opens the maps app with your location
- `getMapsAppName()` - Returns "Apple Maps" or "Google Maps" for UI

**URL Formats:**

**iOS (Apple Maps):**
```
maps://?q=36.1523,-115.2437
```

**Android (Google Maps app):**
```
geo:36.1523,-115.2437?q=36.1523,-115.2437(Y&Y Beauty Salon)
```

**Desktop (Google Maps web):**
```
https://www.google.com/maps/search/?api=1&query=36.1523,-115.2437
```

---

### 2. Added Coordinates to Config

**Files:** `.env`, `.env.example`, `src/config/env.ts`

**New environment variables:**
```env
# Coordinates for accurate directions
VITE_BUSINESS_LATITUDE=36.1523
VITE_BUSINESS_LONGITUDE=-115.2437
```

**Why coordinates?**
- More accurate than address strings
- Works consistently across all map providers
- No ambiguity or typos

**How to find your coordinates:**
1. Go to Google Maps
2. Right-click on your exact location
3. Click the coordinates (first item in menu)
4. Coordinates are copied!
5. Paste into `.env`

---

### 3. Updated Components

**Files:** `Footer.tsx`, `BookingCTA.tsx`

**Before:**
```tsx
<a href={env.business.googleMapsUrl} target="_blank">
  Get Directions
</a>
```

**After:**
```tsx
<button onClick={() => openMaps({
  address: env.business.address.full,
  latitude: env.business.location.latitude,
  longitude: env.business.location.longitude,
})}>
  Get Directions
</button>
```

**Benefits:**
- Detects device automatically
- Opens native app
- Better UX
- More likely to get customers to visit!

---

## 🧪 Testing

### Desktop (Easiest to test):

1. **Run dev server:**
   ```bash
   npm run frontend:dev
   ```

2. **Go to:** http://localhost:3000

3. **Scroll to footer** and click the address

4. **Expected:** Google Maps website opens in new tab

---

### iPhone/iPad:

**Option A: Test on real device**

1. Deploy to staging (or use ngrok to expose localhost)
2. Visit on your iPhone
3. Click the address in footer
4. **Expected:** Apple Maps app opens

**Option B: Test URL format in browser**

1. On your iPhone, open Safari
2. Type in address bar: `maps://?q=36.1523,-115.2437`
3. Press Go
4. **Expected:** Apple Maps opens

---

### Android:

**Option A: Test on real device**

1. Deploy to staging
2. Visit on your Android phone
3. Click the address in footer
4. **Expected:** Google Maps app opens

**Option B: Test URL format in browser**

1. On Android, open Chrome
2. Type: `geo:36.1523,-115.2437?q=36.1523,-115.2437`
3. **Expected:** Prompts to open Google Maps

---

## 📊 Device Detection Logic

```typescript
const getDeviceType = () => {
  const userAgent = navigator.userAgent;

  // Check for iOS
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return 'ios';  // Use Apple Maps
  }

  // Check for Android
  if (/android/i.test(userAgent)) {
    return 'android';  // Use Google Maps app
  }

  // Everything else
  return 'desktop';  // Use Google Maps web
};
```

**Detects:**
- ✅ iPhone, iPad, iPod → iOS
- ✅ All Android devices → Android
- ✅ Windows, Mac, Linux → Desktop

---

## 🎨 User Experience Flow

### Customer Journey:

1. **Customer visits your site** on their iPhone

2. **Scrolls to footer** to find your address

3. **Clicks the address** (or "Get Directions" button)

4. **Apple Maps opens instantly** with directions to your salon

5. **Customer gets turn-by-turn directions** in their familiar app

6. **More likely to visit!**

---

## 🔧 Customization

### Change the Coordinates:

**Edit `.env`:**
```env
VITE_BUSINESS_LATITUDE=36.1234    # Your new latitude
VITE_BUSINESS_LONGITUDE=-115.5678 # Your new longitude
```

**Restart dev server:**
```bash
npm run frontend:dev
```

---

### Change the Address:

**Edit `.env`:**
```env
VITE_BUSINESS_ADDRESS_FULL=123 New Street, New City, NV 89101
```

**Note:** The maps utility will use coordinates if available, otherwise falls back to address string.

---

### Force a Specific Maps App:

If you want to force Google Maps on all devices:

**In components:**
```tsx
// Instead of:
openMaps({ address, latitude, longitude })

// Use:
window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`)
```

**If you want to force Apple Maps on all devices:**
```tsx
window.open(`http://maps.apple.com/?ll=${latitude},${longitude}`)
```

---

## 🌐 Production Deployment

### On Render:

**Frontend environment variables:**
```env
VITE_BUSINESS_LATITUDE=36.1523
VITE_BUSINESS_LONGITUDE=-115.2437
VITE_BUSINESS_ADDRESS_FULL=1820 S Rainbow Blvd, Las Vegas, NV 89146
```

**That's it!** The smart detection works automatically.

---

## ✅ Benefits

### For Customers:
- ✅ Opens their preferred/native maps app
- ✅ Faster than mobile website
- ✅ Turn-by-turn navigation ready
- ✅ Can save location easily
- ✅ Works offline (after first load)

### For You:
- ✅ More customers find your salon
- ✅ Better user experience
- ✅ Professional feel
- ✅ Set-and-forget (no maintenance)

### Technical:
- ✅ Works on all devices automatically
- ✅ Graceful fallback to address if coordinates missing
- ✅ No external dependencies
- ✅ Fast and lightweight

---

## 🐛 Troubleshooting

### "Nothing happens when I click"

**Check browser console (F12):**
- Look for JavaScript errors
- Maps utility might not be imported

**Quick fix:**
```tsx
// Add to component
import { openMaps } from '../utils/maps';
```

---

### "Opens Google Maps on iPhone instead of Apple Maps"

**Check the URL being generated:**
```tsx
import { getMapsUrl } from '../utils/maps';

console.log(getMapsUrl({
  address: 'Your address',
  latitude: 36.1523,
  longitude: -115.2437
}));
```

**Should see:** `maps://?q=36.1523,-115.2437` on iOS

**If not:**
- Device detection might be failing
- Test on real device, not emulator

---

### "Coordinates are wrong / Shows wrong location"

**Find the correct coordinates:**
1. Go to Google Maps
2. Search for your salon
3. Right-click on the exact location
4. Click coordinates to copy
5. Update `.env`:
   ```env
   VITE_BUSINESS_LATITUDE=<your_lat>
   VITE_BUSINESS_LONGITUDE=<your_lng>
   ```
6. Restart dev server

---

## 🎯 Real-World Examples

### Your Salon (Y&Y Beauty):
```typescript
openMaps({
  address: '1820 S Rainbow Blvd, Las Vegas, NV 89146',
  latitude: 36.1523,
  longitude: -115.2437,
})
```

**iPhone user sees:** Apple Maps with Y&Y Beauty Salon location
**Android user sees:** Google Maps app with Y&Y Beauty Salon location
**Desktop user sees:** Google Maps website with Y&Y Beauty Salon location

---

## 📝 Summary

**What you got:**
- ✅ Smart device detection
- ✅ Native maps app opening
- ✅ Better customer experience
- ✅ Coordinates for accuracy
- ✅ Easy to update via .env

**Files changed:**
- ✅ `frontend/src/utils/maps.ts` - New smart maps utility
- ✅ `frontend/src/config/env.ts` - Added coordinates
- ✅ `frontend/.env` - Added coordinate variables
- ✅ `frontend/src/components/Footer.tsx` - Using smart maps
- ✅ `frontend/src/components/BookingCTA.tsx` - Using smart maps

**Customer impact:**
- ✅ iPhone users: Opens Apple Maps
- ✅ Android users: Opens Google Maps app
- ✅ Desktop users: Opens Google Maps website
- ✅ More likely to visit your salon!

---

**Test it now:** Run `npm run frontend:dev` and click the address in the footer!

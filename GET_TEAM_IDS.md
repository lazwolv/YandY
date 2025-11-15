# Getting Team Member IDs

You need to replace the placeholder IDs in `TeamPreview.tsx` with actual database IDs.

## Method 1: Using Prisma Studio (Easiest)

I started Prisma Studio for you in the background.

1. Open your browser to: http://localhost:5555
2. Click on "TeamMember" table
3. Copy the `id` values for:
   - Yaneidis Hidalgo
   - Yailex Hidalgo
   - Diana Laura Martinez

4. Replace in `frontend/src/components/TeamPreview.tsx` (lines 15, 23, 31):
   ```typescript
   id: 'yaneidis-id', // Replace with actual ID
   id: 'yailex-id',   // Replace with actual ID
   id: 'diana-id',    // Replace with actual ID
   ```

## Method 2: Using Backend API

Run this command to query the team members:
```bash
cd C:/Respositories/YandY/backend
npm run dev
```

Then in another terminal:
```bash
curl http://localhost:8000/api/team-members
```

## Method 3: Direct Database Query

```bash
cd C:/Respositories/YandY/backend
npx prisma studio
```

OR connect to your PostgreSQL database directly and run:
```sql
SELECT id, "fullName", specialty
FROM "User" u
JOIN "TeamMember" tm ON u.id = tm."userId"
WHERE u."fullName" IN ('Yaneidis Hidalgo', 'Yailex Hidalgo', 'Diana Laura Martinez');
```

---

## After Getting IDs

Once you have the IDs, the "Book with X" buttons will correctly pre-select that team member in the booking flow!

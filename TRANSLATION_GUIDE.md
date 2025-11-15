# Translation Guide - Y&Y Beauty Salon

## Where to Translate

**File**: `frontend/src/contexts/LanguageContext.tsx`

Look for lines with `// TODO: TRANSLATE` comments in the **ES** (Spanish) section starting around line 418.

## How to Translate

1. Find each line marked with `// TODO: TRANSLATE`
2. Replace the empty string `''` with your Spanish translation
3. Remove the `// TODO: TRANSLATE` comment after translating

### Example:

**Before:**
```typescript
'booking.pleaseLogin': '', // TODO: TRANSLATE
```

**After:**
```typescript
'booking.pleaseLogin': 'Por Favor Inicia Sesión',
```

---

## Translation Keys to Fill In

### Booking Page - Authentication (Lines 419-421)
- `booking.pleaseLogin` - "Please Login"
- `booking.loginRequired` - "You need to be logged in to book an appointment"
- `booking.goToLogin` - "Go to Login"

### Booking Page - Header (Line 425)
- `booking.hiUser` - "Hi {name}, let's find the perfect time for you"
  - **Note**: Keep `{name}` as-is (it's a placeholder)

### Booking Page - Progress Steps (Lines 428-430)
- `booking.step.employee` - "Employee"
- `booking.step.services` - "Services"
- `booking.step.time` - "Time"

### Booking Page - Step 1 (Lines 433-435)
- `booking.step1.title` - "Step 1: Choose Your Nail Technician"
- `booking.loadingTeamMembers` - "Loading team members..."
- `booking.noTeamMembers` - "No team members available at this time. Please try again later."

### Booking Page - Step 2 (Lines 438-443)
- `booking.step2.title` - "Step 2: Select Services"
- `booking.servicesSelected` - "({count} selected)"
  - **Note**: Keep `{count}` as-is (it's a placeholder)
- `booking.loadingServices` - "Loading services..."
- `booking.noServices` - "No services available at this time. Please try again later."
- `booking.minutes` - "minutes"
- `booking.min` - "min"

### Booking Page - Step 3 / Time Slots (Lines 446-461)
- `booking.step3.title` - "Step 3: Select Time Slot"
- `booking.lookingForSlots` - "Looking for {duration}-minute slots"
  - **Note**: Keep `{duration}` as-is
- `booking.withEmployee` - "with {name}"
  - **Note**: Keep `{name}` as-is
- `booking.onDate` - "on {date}"
  - **Note**: Keep `{date}` as-is
- `booking.filterByDate` - "Filter by Date (optional)"
- `booking.showAllDates` - "Show All Dates"
- `booking.showingAllSlots` - "Showing all available slots for the next 7 days"
- `booking.findingSlots` - "Finding available slots..."
- `booking.checkingDate` - "Checking this date"
- `booking.checkingDays` - "Checking the next 7 days"
- `booking.noSlotsAvailable` - "No slots available"
- `booking.noSlotsOnDay` - "No {duration}-minute slots available on this day. Try selecting a different date."
  - **Note**: Keep `{duration}` as-is
- `booking.noSlotsNext7Days` - "No {duration}-minute slots available in the next 7 days. Try selecting different services or check back later."
  - **Note**: Keep `{duration}` as-is
- `booking.slotCount` - "({count} slot)"
  - **Note**: Keep `{count}` as-is
- `booking.slotCountPlural` - "({count} slots)"
  - **Note**: Keep `{count}` as-is
- `booking.to` - "to"

### Booking Page - Date Formatting (Lines 464-465)
- `booking.date.today` - "Today"
- `booking.date.tomorrow` - "Tomorrow"

### Booking Page - Additional Notes (Line 468)
- `booking.additionalNotes` - "Additional Notes (optional)"

### Booking Page - Submit Button (Lines 471-474)
- `booking.creatingAppointment` - "Creating Appointment..."
- `booking.bookServices` - "Book {count} Service with {name}"
  - **Note**: Keep `{count}` and `{name}` as-is
- `booking.bookServicesPlural` - "Book {count} Services with {name}"
  - **Note**: Keep `{count}` and `{name}` as-is
- `booking.smsConfirmation` - "* You'll receive an SMS confirmation once your appointment is confirmed"

### Booking Page - Error Messages (Lines 477-480)
- `booking.error.selectTeamMember` - "Please select a team member"
- `booking.error.selectService` - "Please select at least one service"
- `booking.error.selectTimeSlot` - "Please select a time slot"
- `booking.error.mustBeLoggedIn` - "You must be logged in to book an appointment"

---

## Translation Tips

1. **Formal vs. Informal**: Decide if you want to use "tú" (informal) or "usted" (formal)
   - Current translations use informal "tú" (e.g., "Reserva tu Cita")
   - Stay consistent with your choice

2. **Placeholders**: Keep placeholders like `{name}`, `{count}`, `{duration}`, `{date}` unchanged
   - They will be replaced with actual values at runtime

3. **Gender**: Spanish often requires gender agreement
   - Default to feminine for salon/beauty context if ambiguous
   - "Bienvenida" (welcome, feminine) vs "Bienvenido" (masculine)

4. **Technical Terms**:
   - "Slot" = "espacio" or "horario disponible"
   - "Team member" = "técnica" or "especialista" (for nail tech context)
   - "Loading" = "Cargando"

5. **Test After Translating**:
   - Switch language to Spanish in the website
   - Navigate through the booking flow
   - Check that all text appears correctly

---

## Quick Reference - Common Phrases

| English | Spanish (Informal) | Spanish (Formal) |
|---------|-------------------|------------------|
| Please | Por favor | Por favor |
| Select | Selecciona | Seleccione |
| Choose | Elige | Elija |
| Book | Reserva | Reserve |
| Loading... | Cargando... | Cargando... |
| Available | Disponible | Disponible |
| No... available | No hay... disponibles | No hay... disponibles |
| Try again | Intenta nuevamente | Intente nuevamente |

---

## Status

**Total Keys to Translate**: 47 keys
**Completed**: 0 / 47
**File**: `frontend/src/contexts/LanguageContext.tsx` (Lines 419-480)

Once completed, all booking page text will automatically appear in Spanish when users select "ES" in the language toggle!

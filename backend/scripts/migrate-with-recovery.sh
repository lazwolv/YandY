#!/bin/bash

# Migration script with automatic recovery from failed migrations
# This script handles the Prisma P3009 error by resolving failed migrations

echo "🔍 Checking migration status..."

# Try to apply migrations
if npx prisma migrate deploy 2>&1 | grep -q "P3009"; then
  echo "⚠️  Failed migration detected. Attempting to recover..."

  # Mark the failed migration as rolled back
  npx prisma migrate resolve --rolled-back 20251031231506_add_language_preference_to_user

  echo "✅ Failed migration marked as rolled back. Retrying migration..."

  # Try to apply migrations again
  npx prisma migrate deploy
else
  echo "✅ Migrations applied successfully"
fi

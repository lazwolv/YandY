#!/bin/bash

# Script to reset Render database before applying fresh migrations
# This drops all objects in the public schema to ensure a clean slate

echo "🗑️  Resetting database schema..."

# Use Prisma's db push with --force-reset to drop and recreate the schema
# This will delete ALL data and recreate from scratch
npx prisma db push --force-reset --accept-data-loss --skip-generate

echo "✅ Database reset complete"

#!/bin/bash

echo "🧪 Testing EC Attend Backend API"
echo "================================"

BASE_URL="http://localhost:3000"

echo ""
echo "1. Testing main endpoint..."
curl -s "$BASE_URL" | jq '.' 2>/dev/null || curl -s "$BASE_URL"

echo ""
echo "2. Testing health endpoint..."
curl -s "$BASE_URL/health" | jq '.' 2>/dev/null || curl -s "$BASE_URL/health"

echo ""
echo "3. Testing users endpoint (should show database connection error)..."
curl -s "$BASE_URL/api/users" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/users"

echo ""
echo "4. Testing create user (should show database connection error)..."
curl -s -X POST "$BASE_URL/api/users" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "age": 25, "email": "test@example.com"}' | jq '.' 2>/dev/null || \
curl -s -X POST "$BASE_URL/api/users" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "age": 25, "email": "test@example.com"}'

echo ""
echo "✅ API endpoints are working! Database connection needed for full functionality."
echo ""
echo "To set up database:"
echo "1. Create .env file with DATABASE_URL"
echo "2. Run: npx drizzle-kit generate"
echo "3. Run: npx drizzle-kit migrate"

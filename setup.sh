#!/bin/bash
set -euo pipefail

set -a && source docker.env && set +a

echo "🧹 Cleaning up containers..."
docker compose down -v

echo "🧱 Starting PostgreSQL..."
docker compose up -d --wait

echo "📦 Installing dependencies..."
pnpm install

echo "🧬 Applying DB schema..."
pnpm db:push
#!/bin/bash
set -euo pipefail

source .env

echo "🧹 Cleaning up containers..."
docker compose down -v

echo "🗑️ Removing PostgreSQL data..."
docker volume rm monorepo-template_postgres_data 2>/dev/null || true

echo "✅ Teardown complete!"
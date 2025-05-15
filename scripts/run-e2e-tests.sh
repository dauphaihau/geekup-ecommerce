#!/bin/bash

set -e
#export NODE_ENV=test

# Load test environment variables into shell
set -a
source .env.test
set +a

COMPOSE_FILE="docker-compose.test.yml"

echo "🚀 Starting PostgreSQL test database..."
docker compose -f $COMPOSE_FILE up -d --wait

echo "⏳ Waiting for database to become healthy..."
until docker compose -f $COMPOSE_FILE exec -T db pg_isready -U test_user > /dev/null 2>&1; do
  sleep 1
done

echo "✅ Database is ready."

echo "🔍 Running e2e tests..."
NODE_ENV=test jest --config jest-e2e.config.js --setupFilesAfterEnv ./test/setup.e2e.ts --watchAll --runInBand --detectOpenHandles
#jest --config jest-e2e.config.js --setupFilesAfterEnv ./test/setup.e2e.ts --watchAll --runInBand --detectOpenHandles

echo "🧹 Cleaning up..."
docker compose -f $COMPOSE_FILE down -v

echo "✅ Done."
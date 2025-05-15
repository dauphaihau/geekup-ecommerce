#!/bin/bash
set -e

echo "▶️  Copying migration and seed SQL files to /docker-entrypoint-initdb.d..."

cp /migrations/*.sql /docker-entrypoint-initdb.d/ || true
cp /seeds/*.sql /docker-entrypoint-initdb.d/ || true

echo "🚀 Starting Postgres with official entrypoint..."
exec docker-entrypoint.sh postgres
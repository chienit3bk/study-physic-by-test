#!/bin/sh
set -e

HOST="${DB_HOST:-physic-test-postgres}"
PORT="${DB_PORT:-5432}"

echo "Waiting for Postgres at ${HOST}:${PORT}..."
until node -e "require('net').connect({host:'${HOST}',port:${PORT}}).on('connect',function(){process.exit(0)}).on('error',function(){process.exit(1)})" 2>/dev/null; do
  echo "  ...database not ready, retrying in 2s"
  sleep 2
done

echo "Running migrations..."
npm run db:migrate

echo "Seeding database (ignored if already seeded)..."
npm run db:seed || true

exec "$@"

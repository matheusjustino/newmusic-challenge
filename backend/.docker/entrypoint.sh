#!/bin/sh

echo "Running ls..."
ls

echo "Running ls /dist..."
ls /dist

echo "Running ls /src..."
ls /src



echo "Running database generation..."
npx drizzle-kit generate

echo "Running database migrations..."
npx drizzle-kit migrate

echo "Starting application..."
# node dist/main.js
node dist/src/main.js
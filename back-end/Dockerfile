# syntax=docker/dockerfile:1
FROM node:22-alpine

WORKDIR /usr/src/app

# Install dependencies first for better layer caching.
COPY package*.json ./
RUN npm install

# Copy the rest of the source.
COPY . .

ENV PORT=3000
EXPOSE 3000

# entrypoint waits for Postgres, runs migrations + seeds, then starts the server.
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

# Default to the hot-reload dev server (overridable in docker-compose / CLI).
CMD ["npm", "run", "dev"]

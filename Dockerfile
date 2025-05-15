# Stage 1: Install dependencies
FROM node:20 AS install-deps
RUN npm install -g pnpm
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:20 AS builder
WORKDIR /usr/src/app
COPY --from=install-deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm
RUN pnpm build

# Stage 3: Production
FROM node:20-slim as production
WORKDIR /usr/src/app
RUN npm install -g pnpm
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=install-deps /usr/src/app/node_modules ./node_modules
COPY package.json ./
RUN pnpm install --production --frozen-lockfile
EXPOSE 3000
CMD ["node", "dist/main.js"]

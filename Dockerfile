FROM node:20-alpine AS builder
WORKDIR /app
# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm run build

FROM node:20-alpine
WORKDIR /app
# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY --from=builder /app ./
EXPOSE 3000
CMD ["pnpm", "start"]

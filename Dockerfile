# Base stage
FROM node:24.13.1-alpine AS base
WORKDIR /app
RUN apk add --no-cache dumb-init
COPY package*.json ./
COPY prisma ./prisma

# Build stage (for prisma generate)
FROM base AS builder
RUN npm ci
COPY src ./src
RUN npm run prisma:generate

# Production stage
FROM base AS runner
RUN npm ci --only=production && \
    npm cache clean --force
COPY src ./src
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health/ping', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/server.js"]

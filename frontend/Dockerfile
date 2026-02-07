# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.13.1

# Build stage
FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app

# Accept Vite API base URL at build time (from docker compose build.args)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Install dependencies (npm ci for deterministic builds)
COPY --link package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the application source
COPY --link . .

# Build the app (Vite build)
RUN npm run build

# Remove dev dependencies to reduce image size
RUN rm -rf node_modules && \
    npm ci --omit=dev

# Production stage
FROM node:${NODE_VERSION}-slim AS final
WORKDIR /app

# Create non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy built app and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Ensure a writable HOME for npm and the non-root user (avoid /nonexistent)
ENV HOME=/home/appuser
RUN mkdir -p "$HOME" && chown -R appuser:appgroup "$HOME"

# Install a small static server to serve the built assets
RUN npm i -g serve

# Switch to non-root user
USER appuser

# Expose the frontend port (aligns with compose mapping 5173:5173)
EXPOSE 5173

# Serve the built site from /app/dist
CMD ["serve", "-s", "dist", "-l", "5173", "--single"]

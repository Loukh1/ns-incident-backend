# Dockerfile for React Vite app without Nginx
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies (including dev dependencies for vite preview)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port (Vite preview default is 4173)
EXPOSE 4173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4173 || exit 1

# Run preview server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
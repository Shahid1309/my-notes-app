# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy only package.json and package-lock.json first (to cache npm install layer)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code AFTER installing dependencies
COPY . .

# Build Next.js app
RUN npm run build

# Stage 2: Production image
FROM node:22-alpine

WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app ./

# Expose port 3000
EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "start"]


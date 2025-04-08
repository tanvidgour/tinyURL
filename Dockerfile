FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy client package.json
COPY client/package*.json ./client/

# Install client dependencies
RUN cd client && npm install

# Copy the rest of the app
COPY . .

# Build the client
RUN cd client && npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy built application from build stage
COPY --from=build /app/src ./src
COPY --from=build /app/client/dist ./client/dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start the app
CMD ["node", "src/index.js"] 
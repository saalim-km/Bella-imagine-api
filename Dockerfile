# Use a lighter base image
FROM node:22-slim

# Set working directory
WORKDIR /app

# Copy only what's needed first
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source code
COPY ./src ./src
COPY tsconfig.json ./

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3002

# Start the app
CMD ["npm", "run", "start"]
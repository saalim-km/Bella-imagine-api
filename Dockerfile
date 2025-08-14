FROM node:22

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your source code
COPY . .

# Build TypeScript inside the container
RUN npm run build

# Expose API port
EXPOSE 3002

# Start directly with Node instead of npm run start (faster)
CMD ["node", "dist/index.js"]
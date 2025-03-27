FROM node:18

WORKDIR /app

# Copy package files for server and client
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd client && npm install

# Copy all project files
COPY . .

# Build React app
RUN cd client && npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
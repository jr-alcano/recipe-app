# Stage 1: Build the React client
FROM node:18 AS client-build
WORKDIR /app
COPY client/ ./client
RUN cd client && npm install && npm run build

# Stage 2: Setup the backend server
FROM node:18

# Set working directory to /app/server
WORKDIR /app/server

# Copy server code into the container
COPY server/ ./

# Copy built React frontend into /app/server/build
COPY --from=client-build /app/client/build ./build

# Install backend dependencies
RUN npm install

ENV PORT=3001
EXPOSE 3001

# Start the Express server
CMD ["node", "index.js"]

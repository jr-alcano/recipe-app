# Stage 1: Build the React client
FROM node:18 AS client-build
WORKDIR /app
COPY client/ ./client
RUN cd client && npm install && npm run build

# Stage 2: Setup the backend
FROM node:18

WORKDIR /app

# Copy backend files (your entire server folder into /app/server)
COPY server/ ./server

# Copy client build output into the backend server directory
COPY --from=client-build /app/client/build ./server/client/build

# Set working directory to /app/server
WORKDIR /app/server
RUN npm install

ENV PORT=3001
EXPOSE 3001

CMD ["node", "index.js"]

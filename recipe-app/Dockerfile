# Stage 1: Build the React client
FROM node:18 AS client-build
WORKDIR /app
COPY client/ ./client
RUN cd client && npm install && npm run build

# Stage 2: Set up the server and serve client build
FROM node:18

WORKDIR /app

# Copy server files and client build
COPY server/ ./
COPY --from=client-build /app/client/build client/build

# Install server dependencies
RUN npm install

# Set environment and expose port
ENV PORT=3001
EXPOSE 3001

# Run the server using the start script in server/package.json
CMD ["npm", "start"]

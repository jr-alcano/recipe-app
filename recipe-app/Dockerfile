# Stage 1: Build the React client
FROM node:18 AS client-build
WORKDIR /app
COPY client/ ./client
RUN cd client && npm install && npm run build

# Stage 2: Set up the server and serve client build
FROM node:18

# Make working dir /app/server to match what Railway expects
WORKDIR /app/server

# Copy the server files into /app/server
COPY server/ ./

# Copy client build into the appropriate location inside server
COPY --from=client-build /app/client/build ./client/build

# Install dependencies from server's package.json
RUN npm install

ENV PORT=3001
EXPOSE 3001

CMD ["npm", "start"]

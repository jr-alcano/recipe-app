# Stage 1: Build the React client
FROM node:18 AS client-build
WORKDIR /app
COPY client/ ./client
RUN cd client && npm install && npm run build

# Stage 2: Set up the server and serve built frontend
FROM node:18

# Put everything under /app
WORKDIR /app

# Copy contents of server/ into /app (not into /app/server!)
COPY server/ ./

# Copy client build files into the server's static folder
COPY --from=client-build /app/client/build ./client/build

# Install backend dependencies
RUN npm install

ENV PORT=3001
EXPOSE 3001

CMD ["node", "index.js"]

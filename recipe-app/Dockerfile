# Stage 1: Build the React client
FROM node:18 AS client-build
WORKDIR /app
COPY client/ ./client        
RUN cd client && npm install && npm run build

# Stage 2: Setup server and serve built frontend
FROM node:18
WORKDIR /app/server
COPY server/ ./              
COPY --from=client-build /app/client/build ./client/build
RUN npm install

ENV PORT=3001
EXPOSE 3001

CMD ["node", "index.js"]

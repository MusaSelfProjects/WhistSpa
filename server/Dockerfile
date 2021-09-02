FROM node:latest
WORKDIR /api
COPY package*.json ./
RUN npm i
COPY . .
CMD ["node",  "server.js"]
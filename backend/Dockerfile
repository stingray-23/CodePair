FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache python3 g++ gcc openjdk11 go rust cargo openssl
RUN npm install -g typescript ts-node
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 4000
CMD ["node", "src/index.js"]

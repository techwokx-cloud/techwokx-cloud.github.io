FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++ git font-noto-emoji fontconfig

COPY package.json .
RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]

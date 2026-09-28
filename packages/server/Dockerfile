FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY packages/server ./

EXPOSE 5000

CMD ["npm", "start"]

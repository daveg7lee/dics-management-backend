FROM node:16 AS builder
WORKDIR /app

COPY package*.json ./


RUN npm i

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:16-alpine
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app ./
CMD ["npm", "run", "start:migrate:prod"]
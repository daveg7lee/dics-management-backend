FROM node:16 AS builder
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm i

COPY . .

RUN npm run build

FROM node:16-alpine
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

CMD ["npm", "run", "start:migrate:prod"]
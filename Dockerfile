FROM node:16 AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/

RUN yarn install

COPY . .

RUN yarn run build

FROM node:16
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

CMD [ "yarn", "start:migrate:prod" ]
EXPOSE 4000

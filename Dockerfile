FROM node:14
ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY package* .

RUN npm install --production

COPY ./src ./src

CMD [ "node", "src/main.js" ]

## docker build --tag jefaokpta/node-whats:1.2 .
## docker run -d --name=whats-12 -p3001:3000 -e COMPANY=12 -e API_PORT=3001 --restart=on-failure -v /tmp/whatsMediaHost:/whatsMedia jefaokpta/node-whats:1.0

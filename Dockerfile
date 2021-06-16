FROM node:14
ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY package* .

RUN npm install --production

COPY ./src ./src

CMD [ "node", "src/main.js" ]

## docker build --tag jefaokpta/node-whats:1.0 .
## docker run -d --name=whats-3001 -p3001:3000 -e COMPANY=12 --restart=on-failure jefaokpta/node-whats:1.0

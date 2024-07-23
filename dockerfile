FROM node:20-alpine

WORKDIR /usr/src/app

RUN --mount=type=bind,source=package.json,target=package.json \
--mount=type=bind,source=package-lock.json,target=package-lock.json \
--mount=type=bind,target=log/ \
--mount=type=cache,target=/root/.npm

COPY package*.json ./

RUN npm install
RUN npm install pm2 -g
COPY ./prisma ./prisma
RUN npm run build
RUN chown -R node /usr/src/app

EXPOSE 3001
EXPOSE 8282
USER node

COPY . .

CMD ["pm2-runtime", "start", "app.js" ] 
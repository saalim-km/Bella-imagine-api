FROM node:22

COPY  package*.json ./

RUN npm install

COPY  . .

RUN npm run build

EXPOSE 3002

CMD [ "node","dist/index.js" ]
FROM node:22

COPY  package*.json ./

RUN npm install

COPY  . .

RUN npm run build

EXPOSE 3002

CMD ["npm", "run", "start"]
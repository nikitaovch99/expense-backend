FROM node

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . .

ENV PORT 7000

EXPOSE $PORT

VOLUME [ "/app/data" ]

CMD [ "npm", "run", "start" ]
From node

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 10080

CMD [ "node", "main.js" ]


FROM docker.io/node:17-alpine AS builder
WORKDIR /build
#RUN apk add
RUN npm install -g @vercel/ncc

ADD package.json .
RUN npm install --production
ADD src src
RUN ncc build src/main.js

FROM docker.io/alpine:latest
WORKDIR /app
RUN apk add nodejs
COPY --from=builder /build/dist/index.js /app/main.js

CMD [ "node", "/app/main.js" ]

FROM node:10-alpine

RUN apk add git

COPY ./src /

RUN npm install

ENTRYPOINT [ "/entrypoint.sh" ]

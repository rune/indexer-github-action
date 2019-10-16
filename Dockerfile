FROM node:10-alpine

RUN apk add git

COPY . /

RUN npm install

ENTRYPOINT [ "/src/entrypoint.sh" ]

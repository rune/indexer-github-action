FROM node:12-alpine

RUN apk add git

COPY . /

RUN yarn

ENTRYPOINT [ "/src/entrypoint.sh" ]

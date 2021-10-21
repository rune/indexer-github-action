FROM node:12-alpine

RUN apk add git

COPY . /

RUN yarn --production

ENTRYPOINT [ "/src/entrypoint.sh" ]

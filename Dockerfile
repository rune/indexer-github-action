FROM node:10-alpine

RUN apk add git

COPY ./src /

ENTRYPOINT [ "/entrypoint.sh" ]

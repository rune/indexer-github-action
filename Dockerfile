FROM node:10-alpine

apk add git

COPY ./src /

ENTRYPOINT [ "/entrypoint.sh" ]

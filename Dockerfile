FROM node:10-alpine

COPY ./src /

ENTRYPOINT [ "/entrypoint.sh" ]

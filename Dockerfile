FROM node:10-alpine

RUN apk add git

COPY . /

RUN npm install --production

ENTRYPOINT [ "/src/entrypoint.sh" ]

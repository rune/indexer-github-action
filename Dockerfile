FROM node:10-alpine

COPY .. /

ENTRYPOINT [ "/.github/src/entrypoint.sh" ]

FROM node:14.3-alpine
WORKDIR /usr/src/app

COPY . .
RUN \
  apk add yarn && \
  apk add python && \
  yarn install && \
  yarn build

EXPOSE 3030
CMD ["npm", "start"]
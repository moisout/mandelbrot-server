FROM node:14.3-alpine
WORKDIR /usr/src/app

COPY . .
RUN \
  apk add yarn build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev python && \
  yarn install && \
  yarn build

EXPOSE 3030
CMD ["npm", "start"]
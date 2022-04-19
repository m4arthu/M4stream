FROM node:17-slim

RUN apt-get update \
  && apt-get install -y sox libsox-fmt-mp3

# libsox-fmt-all

WORKDIR /m4stream-radio/

COPY package.json package-lock.json /m4stream-radio/

RUN npm  ci --silent

COPY . .

USER node

CMD npm run live-reload

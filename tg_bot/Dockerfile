FROM node:alpine as bot
WORKDIR /usr/src/app
COPY package.json package.json
RUN npm install
COPY . .
CMD ["npm", "run", "bot"]
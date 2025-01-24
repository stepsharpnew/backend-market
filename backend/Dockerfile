FROM node:alpine as build
WORKDIR /usr/src/app
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["node", "dist/main"]
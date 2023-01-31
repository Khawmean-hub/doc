FROM node:lts-alpine
WORKDIR /home/app
COPY package*.json ./
USER node
RUN npm install
RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
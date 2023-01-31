FROM node:lts-alpine
WORKDIR /home/app
COPY package*.json ./
USER node
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
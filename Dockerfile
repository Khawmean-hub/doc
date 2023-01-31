FROM node:lts-alpine
RUN mkdir -p /home/app/node_modules && chown -R app:app /home/app
WORKDIR /home/app
COPY package*.json ./
USER node
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
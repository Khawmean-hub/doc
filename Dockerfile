FROM node:lts-alpine
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
USER node
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
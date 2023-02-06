FROM node:16.13.0-alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm config set unsafe-perm true
RUN npm install --silent
RUN mkdir imgs
COPY . .
RUN chown -R root /app/node_modules
USER root
EXPOSE 3000
CMD ["node", "app.js"]
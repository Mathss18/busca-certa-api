FROM node:18.14

WORKDIR /node_app
COPY package.json ./
COPY package-lock.json ./
RUN npm cache clean --force
RUN npm install

WORKDIR /node_app/app
COPY . .
# EXPOSE 3000

CMD ["npm", "run", "start:dev"]
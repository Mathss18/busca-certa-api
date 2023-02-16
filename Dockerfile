FROM node:18.14

RUN npm i -g @nestjs/cli
WORKDIR /node_app
COPY package.json ./
COPY package-lock.json ./
RUN npm cache clean --force
RUN npm install

WORKDIR /node_app/app
USER node
COPY . .
# EXPOSE 3000

# CMD ["npm", "run", "start:dev"]
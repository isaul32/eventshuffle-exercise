FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run lint
RUN npm run build
EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]

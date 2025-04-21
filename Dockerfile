FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5175

CMD ["npm", "run", "dev", "--", "--host", "--port", "5175"]

FROM node:12

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY . /app

RUN npm install


EXPOSE 8000

CMD ["npm", "install"]
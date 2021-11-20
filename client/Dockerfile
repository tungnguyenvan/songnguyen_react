FROM node:latest
RUN npm install -g typescript
RUN mkdir -p /client
WORKDIR /client
COPY package.json /client/
RUN npm install
COPY . /client/
CMD [ "npm start" ]
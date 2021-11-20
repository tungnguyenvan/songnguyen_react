FROM node:latest
RUN npm install -g nodemon
RUN npm install -g tslint
RUN npm install -g typescript
RUN mkdir -p /server
WORKDIR /server
COPY package.json /server/
RUN npm install
COPY . /server/
CMD [ "nodemon ." ]
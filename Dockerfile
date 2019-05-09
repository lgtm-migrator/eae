# Select source image
FROM node:latest

# Create app directories
RUN mkdir -p /usr/app
WORKDIR /usr/app

# Install app dependencies
COPY ./package.json /usr/app/
# Install eae-interface npm dependencies
RUN npm install; exit 0;
RUN cat /root/.npm/_logs/*; exit 0;

# Bundle app
COPY ./src /usr/app/src
COPY ./config/eae.interface.config.js /usr/app/config/eae.interface.config.js

# Run compute service
EXPOSE 80
CMD [ "npm", "start" ]
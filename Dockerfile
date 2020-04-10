FROM node:12.16.3

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm -v
RUN node -v
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/

# Install dependencies
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Expose port 3000
EXPOSE 3000

# Environment variables
ENV NODE_ENV production
ENV PORT 3000

CMD ["npm", "start"]

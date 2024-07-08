# Use an official Node.js image as a base
FROM node:latest as build

# Set the working directory in the container
WORKDIR /chatroom-app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the remaining app files excluding package.json and package-lock.json
COPY . .

# Default Server Url
ARG SERVER_URL='http://127.0.0.1:8080'

# Set the server url
ENV REACT_APP_SERVER_URL=$SERVER_URL

# Build the app
RUN npm run build

# Use a lightweight Node.js image for production
FROM node:alpine

# Set the working directory in the container
WORKDIR /chatroom-app

# Copy the built app from the previous stage
COPY --from=build /chatroom-app/build ./build

# Set the default port (can be overridden at runtime)
ENV PORT=3000

# Make the port specified in the environment variable available to the world outside this container
EXPOSE $PORT

# Run the app by serving the static files
CMD npx http-server -p $PORT ./build
# Use an official node runtime as a parent image
FROM node:buster-slim

WORKDIR /app/

# Install dependencies
# COPY package.json yarn.lock /app/
COPY . /app/

RUN yarn install
# Add rest of the client code

# CMD yarn start
# Build stage
FROM node:18.16.0 as build

## Create app directory
WORKDIR /app

## Bundle app source
COPY . .

## Install app dependencies
RUN yarn

## Build app
RUN yarn build

# Run stage
FROM node:18.16.0

## Switch to less privileged user
USER node

## Create app directory
WORKDIR /app

## Copy app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/package.json ./package.json

## Expose port
EXPOSE 3001

## Declare environment variables
ENV BACKEND_ADDRESS=http://localhost:3000

## Execute app
CMD ["npm", "start"]

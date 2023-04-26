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
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.js ./next.config.js

## Expose port
EXPOSE 3001

## Declare environment variables
ENV NEXT_PUBLIC_BACKEND_URL=http://dffb.org:9211
ENV NEXTAUTH_URL=http://dffb.org:9211
ENV NEXTAUTH_SECRET=secret

## Execute app
CMD ["npm", "start"]

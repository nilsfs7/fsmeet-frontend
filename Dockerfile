# Build stage
FROM node:22.12.0 AS build

## Declare build arguments
ARG COMMIT_SHA=""
ARG BUILD_TIME=""
ARG BACKEND_URL=""
ARG AUTH_URL=""
ARG AUTH_SECRET=secret
ARG GMAPS_API_KEY=maps-api-key

## Declare environment variables
ENV NEXT_PUBLIC_BUILD_TIME=$BUILD_TIME
ENV NEXT_PUBLIC_COMMIT_SHA=$COMMIT_SHA
ENV NEXT_PUBLIC_BACKEND_URL=$BACKEND_URL
ENV NEXTAUTH_URL=$AUTH_URL
ENV NEXTAUTH_SECRET=$AUTH_SECRET
ENV GOOGLE_MAPS_API_KEY=$GMAPS_API_KEY

## Create app directory
WORKDIR /app

## Bundle app source
COPY . .

## Install app dependencies
RUN yarn

## Build app
RUN yarn build



# Run stage
FROM node:22.12.0

## Declare build arguments
ARG TRUST_HOST=true
ARG COMMIT_SHA=""
ARG BUILD_TIME=""
ARG BACKEND_URL=""
ARG AUTH_URL=""
ARG AUTH_SECRET=secret
ARG GMAPS_API_KEY=maps-api-key

## Declare environment variables
ENV AUTH_TRUST_HOST=$TRUST_HOST
ENV NEXT_PUBLIC_BUILD_TIME=$BUILD_TIME
ENV NEXT_PUBLIC_COMMIT_SHA=$COMMIT_SHA
ENV NEXT_PUBLIC_BACKEND_URL=$BACKEND_URL
ENV NEXTAUTH_URL=$AUTH_URL
ENV NEXTAUTH_SECRET=$AUTH_SECRET
ENV GOOGLE_MAPS_API_KEY=$GMAPS_API_KEY

## Switch to less privileged user
USER node

## Create app directory
WORKDIR /app

## Copy app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.mjs ./next.config.mjs

## Expose port
EXPOSE 3001

## Execute app
CMD ["npm", "start"]

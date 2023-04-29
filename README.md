# fsjudge-frontend

## Prerequisites

[yarn](https://yarnpkg.com/)

## Run in Docker

pull image

```
docker pull luisnaldo7/fsjudge-frontend:latest
```

or build image

```
docker build --build-arg COMMIT_SHA=456 -t luisnaldo7/fsjudge-frontend:latest .
```

execute container

```
docker run -d -p 3001:3001 -e NEXT_PUBLIC_BACKEND_URL="http://localhost:3000" --rm --name fsjudge-frontend luisnaldo7/fsjudge-frontend:latest
```

execute container on boot

```
docker run -d -p 3001:3001 -e NEXT_PUBLIC_BACKEND_URL="http://localhost:3000" --restart always --name fsjudge-frontend luisnaldo7/fsjudge-frontend:latest
```

## Fonts

https://fonts.google.com/

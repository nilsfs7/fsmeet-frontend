# fsmeet-frontend

## Donate

FSMeet is free to use and ad-free — built with love for the freestyle family.
If you enjoy it, consider supporting with a small donation. Every bit helps keep it running!

| Network                             | Donation Address                                                                                                                                                       |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bitcoin                             | [bc1qe0yujtzhgjqkmnxuta0wtrpme53et9q3st083p](https://mempool.space/address/bc1qe0yujtzhgjqkmnxuta0wtrpme53et9q3st083p)                                                 |
| Ethereum (also Gnosis, Base, etc..) | [0x3b6F25F4E16F2Dd7208961D60a2934FBc01e2799](https://etherscan.io/address/0x3b6F25F4E16F2Dd7208961D60a2934FBc01e2799)                                                  |
| Solana                              | [3TxQGtepnYypVYjfaDQHjSydfNnohTWJfMdGvCUMDT9i](https://solscan.io/account/3TxQGtepnYypVYjfaDQHjSydfNnohTWJfMdGvCUMDT9i)                                                |
| Sui                                 | [0x4a0102160013f246dea5bca066c454edf0fa0464bf8c5eee6262e2990f313ef9](https://suivision.xyz/account/0x4a0102160013f246dea5bca066c454edf0fa0464bf8c5eee6262e2990f313ef9) |

## Getting started for development

### Understanding the project structure

- `fonts`: Third party fonts that do not come with nextjs by default.
- `messages`: All text for visible elements like inputs, dropdowns, headers, etc.
- `public`: Directory for static images to be displayed. All images are either purchased or free to use SVGs for commercial usage. Further deatils about their origin down below in `Images` section of the readme.
- `src`: Application source code.
  - `src/app`: App router directory. Subdirectories with `page.tsx` files represent routes on the website. Some routes might contain an additional `components` directory that is used to store local components.
  - `src/components`: Global components used in multiple routes. If a component is only used for a specific route it is placed within the app router.
  - `src/domain`: Contains all domain specific definitions like classes, types, enums and constants.
  - `src/infrastructure`: REST based clients for backend communication. Clients should be imported in routes when wanting to request data.

### Prerequisites

- [node.js](https://nodejs.org/en) version `22.12.0` or newer

- [yarn](https://yarnpkg.com/)

- [Docker](https://docs.docker.com/manuals/) Engine & Build

- [Google Maps API key](https://console.cloud.google.com/) (optional)

### The backend

The FSMeet backend is not open sourced but its interface is publicly available and fully documented using [Swagger](https://swagger.io/). There are 2 environments to connect to:

- Dev: An environment providing test data and the latest features that may still be in development (expect bugs 😇). Use for testing purposes especially when it comes to data creation.

  Url: https://api.dev.fsmeet.dffb.org/api

- Prod: A stable environment providing live data for [fsmeet.com](https://fsmeet.com).

  Url: https://api.fsmeet.dffb.org/api

The environments do not share any data. A user account on the production system has to be created on dev separately.

### Run app

Create environment and adjust the variables to your needs

```bash
cp .env.example .env
```

Install dependencies

```bash
yarn install
```

Start app

```bash
yarn dev
```

### Run in Docker

Pull image

```bash
docker pull nilsfs7/fsmeet-frontend:latest
```

or build image

```bash
docker buildx build --build-arg COMMIT_SHA=456 -t nilsfs7/fsmeet-frontend:latest .
```

Execute container

```bash
docker run -d -p 3001:3001 -e NEXT_PUBLIC_BACKEND_URL="http://localhost:3000" --rm --name fsmeet-frontend nilsfs7/fsmeet-frontend:latest
```

or execute container on boot

```bash
docker run -d -p 3001:3001 -e NEXT_PUBLIC_BACKEND_URL="http://localhost:3000" --restart always --name fsmeet-frontend nilsfs7/fsmeet-frontend:latest
```

### Manual testing

- [Credit card list](https://docs.stripe.com/testing?testing-method=card-numbers#visa) for the checkout process

### Create a release

```bash
# patch version
yarn run release:patch

# minor / feature version
yarn run release:minor

# major version
yarn run release:major
```

## Component Library

- [shadcn](https://ui.shadcn.com/docs/components/tabs)

## Content

### Fonts

- [fonts.google.com](https://fonts.google.com/)

### Images

All third party images and their source are listed [here](docs/images.md).

# Crypto Ghost Contract

## Setup

1. Module Install

```sh
npm ci
```

2. Create `.env` file

```sh
touch ../.env
```

- `.env.sample`を参考に必要な情報を追記してください。

```sh
ALCHEMY_API_KEY= # ALCHEMY API KEY
GOERLI_PRIVATE_KEY= # Your Wallet Private Key
REPORT_GAS= # Report Gas True or False
```

- [Alchemy](https://dashboard.alchemy.com/)

## Compile

```sh
npx hardhat clean
npx hardhat compile
```

## Test

### Test Obj

```sh
npx hardhat test --grep Obj
```


## Deploy

### Deploy Test

```sh
npx hardhat run scripts/run.ts
```

```sh
npx hardhat run scripts/deploy.ts
```

### Goerli Testnet

```sh
npx hardhat run scripts/deploy.ts --network goerli
```

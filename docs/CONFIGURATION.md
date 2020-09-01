# Build-time environment options

The app can be configured in a number of ways via environment variables. Without any settings, the app is configured to connect to our Rinkeby deployment fetching metadata from a non-local IPFS Gateway.

## General settings

### `REACT_APP_CHAIN_ID`

Expected chain id to connect to. Either one of `1 (mainnnet)`, `3 (ropsten)`, `4 (rinkeby)` or `1337 (local)`.

### `REACT_APP_DEFAULT_ETH_NODE`

Url of the default Ethereum node to read blockchain data from. If you intend to connect to a local ganache instance, by default you should set this to `http://localhost:8545`.

### `REACT_APP_IPFS_GATEWAY`

Url of the [IPFS](https://ipfs.io) Gateway to load dispute metadata from. If you intend to connect to a local IPFS daemon's Gateway, by default you should set this to `http://localhost:8080/ipfs`.

### `REACT_APP_SUBGRAPH_NAME`

Name of the subgraph instance to connect to and query data from. This is useful when we have different Aragon Court deployments on the same network.

## Ethereum Providers

### `REACT_APP_FORTMATIC_API_KEY`

API key from [Formatic](fortmatic.com). Requires separate keys for testnet / mainnet.

### `REACT_APP_PORTIS_DAPP_ID`

API key from [Portis](portis.io). Requires separate keys for testnet / mainnet.

## Flags

### `REACT_APP_SKIP_VOIDING`

To disable flagging of voided disputes.

## 3rd Party APIs

### `REACT_APP_SENTRY_DSN`

[Sentry DSN](https://docs.sentry.io/error-reporting/configuration/?platform=node#dsn) for forwarding error logs.

## Development settings

### MOCK_DATA

To start the court dashboard with mocked data.

### Assumed localhost ports

- Ethereum node: 8545
- Subgraph:
  - 8000 (HTTP)
- IPFS Gateway: 8080
- Court server: 8050

### Default Mnemonic

`myth like bonus scare over problem client lizard pioneer submit female collect`

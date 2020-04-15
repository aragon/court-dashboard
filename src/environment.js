// rinkeby
const CHAIN_ID_DEFAULT = 4

const ENV_VARS = {
  CHAIN_ID() {
    const chainId = parseInt(process.env.REACT_APP_CHAIN_ID)
    return isNaN(chainId) ? CHAIN_ID_DEFAULT : chainId
  },
  SKIP_VOIDING() {
    return process.env.REACT_APP_SKIP_VOIDING === '1'
  },
  SUBGRAPH_NAME() {
    return process.env.REACT_APP_SUBGRAPH_NAME
  },
  FORTMATIC_API_KEY() {
    return process.env.REACT_APP_FORTMATIC_API_KEY || ''
  },
  PORTIS_DAPP_ID() {
    return process.env.REACT_APP_PORTIS_DAPP_ID || ''
  },
  SENTRY_DSN() {
    const dsn = process.env.REACT_APP_SENTRY_DSN || ''
    return dsn.trim()
  },
  BUILD() {
    return process.env.REACT_APP_BUILD || 'undefined'
  },
  ENABLE_SENTRY() {
    return process.env.REACT_APP_ENABLE_SENTRY === '1'
  },
  DEFAULT_ETH_NODE() {
    return process.env.REACT_APP_DEFAULT_ETH_NODE || ''
  },
  IPFS_GATEWAY() {
    return process.env.REACT_APP_IPFS_GATEWAY || ''
  },
  CUSTOM_HTTP_SUBGRAPH_ENDPOINT() {
    return process.env.REACT_APP_CUSTOM_HTTP_SUBGRAPH_ENDPOINT || ''
  },
  CUSTOM_WS_SUBGRAPH_ENDPOINT() {
    return process.env.REACT_APP_CUSTOM_WS_SUBGRAPH_ENDPOINT || ''
  },
}

export default function env(name) {
  const envVar = ENV_VARS[name]
  return typeof envVar === 'function' ? envVar() : null
}

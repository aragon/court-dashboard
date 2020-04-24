// rinkeby
const CHAIN_ID_DEFAULT = 4

const ENV_VARS = {
  BUILD() {
    return process.env.REACT_APP_BUILD || 'undefined'
  },
  CHAIN_ID() {
    const chainId = parseInt(process.env.REACT_APP_CHAIN_ID)
    return isNaN(chainId) ? CHAIN_ID_DEFAULT : chainId
  },
  SUBGRAPH_HTTP_ENDPOINT() {
    return process.env.REACT_APP_SUBGRAPH_HTTP_ENDPOINT || ''
  },
  SUBGRAPH_WS_ENDPOINT() {
    return process.env.REACT_APP_SUBGRAPH_WS_ENDPOINT || ''
  },
  DEFAULT_ETH_NODE() {
    return process.env.REACT_APP_DEFAULT_ETH_NODE || ''
  },
  ENABLE_SENTRY() {
    return process.env.REACT_APP_ENABLE_SENTRY === '1'
  },
  FORTMATIC_API_KEY() {
    return process.env.REACT_APP_FORTMATIC_API_KEY || ''
  },
  IPFS_GATEWAY() {
    return process.env.REACT_APP_IPFS_GATEWAY || ''
  },
  PORTIS_DAPP_ID() {
    return process.env.REACT_APP_PORTIS_DAPP_ID || ''
  },
  SENTRY_DSN() {
    const dsn = process.env.REACT_APP_SENTRY_DSN || ''
    return dsn.trim()
  },
  SKIP_VOIDING() {
    return process.env.REACT_APP_SKIP_VOIDING === '1'
  },
  SUBGRAPH_NAME() {
    return process.env.REACT_APP_SUBGRAPH_NAME
  },
}

export default function env(name) {
  const envVar = ENV_VARS[name]
  return typeof envVar === 'function' ? envVar() : null
}

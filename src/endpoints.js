import environment from './environment'

import { isLocalOrUnknownNetwork, getNetworkType } from './lib/web3-utils'

const CHAIN_ID = environment('CHAIN_ID')
const COURT_SERVER_NAME = environment('COURT_SERVER_NAME')
const SUBGRAPH_NAME = environment('SUBGRAPH_NAME')

// IPFS endpoint
export const IPFS_ENDPOINT = isLocalOrUnknownNetwork(CHAIN_ID)
  ? 'http://127.0.0.1:8080/ipfs'
  : 'https://ipfs.eth.aragon.network/ipfs'

// Court server endpoint
export function courtServerEndpoint() {
  if (isLocalOrUnknownNetwork(CHAIN_ID)) {
    return 'http://127.0.0.1:8050'
  }

  const networkType = getNetworkType(CHAIN_ID)
  return `https://court-backend${
    networkType === 'main' ? '' : `-${COURT_SERVER_NAME || networkType}`
  }.eth.aragon.network`
}

// The graph endpoints
const GRAPH_API_BASE_HTTP_LOCAL = 'http://127.0.0.1:8000'
const GRAPH_API_BASE_WS_LOCAL = 'ws://127.0.0.1:8001'

const GRAPH_API_BASE_HTTP = 'https://api.thegraph.com'
const GRAPH_API_BASE_WS = 'wss://api.thegraph.com'

const GRAPH_API_PATH = '/subgraphs/name/aragon/aragon-court'

function getAPIBase() {
  return isLocalOrUnknownNetwork(CHAIN_ID)
    ? [GRAPH_API_BASE_HTTP_LOCAL, GRAPH_API_BASE_WS_LOCAL]
    : [GRAPH_API_BASE_HTTP, GRAPH_API_BASE_WS]
}

export function graphEndpoints() {
  const [API_BASE_HTTP, API_BASE_WS] = getAPIBase()
  const networkType = isLocalOrUnknownNetwork()
    ? 'rpc'
    : getNetworkType(CHAIN_ID)

  const API_PATH =
    networkType === 'main'
      ? GRAPH_API_PATH
      : `${GRAPH_API_PATH}-${SUBGRAPH_NAME || networkType}`

  return [`${API_BASE_HTTP}${API_PATH}`, `${API_BASE_WS}${API_PATH}`]
}

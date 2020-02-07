import environment from './environment'

import { isLocalOrUnknownNetwork, getNetworkName } from './lib/web3-utils'

const CHAIN_ID = environment('CHAIN_ID')

// The graph endpoints
const GRAPH_API_BASE_HTTP_LOCAL = 'http://127.0.0.1:8000'
const GRAPH_API_BASE_WS_LOCAL = 'ws://127.0.0.1:8001'

const GRAPH_API_BASE_HTTP = 'https://api.thegraph.com'
const GRAPH_API_BASE_WS = 'wss://api.thegraph.com'

export const IPFS_ENDPOINT = isLocalOrUnknownNetwork(CHAIN_ID)
  ? 'http://127.0.0.1:8080/ipfs'
  : 'https://ipfs.eth.aragon.network/ipfs'

const GRAPH_API_PATH = '/subgraphs/name/aragon/aragon-court'

function getAPIBase() {
  return isLocalOrUnknownNetwork(CHAIN_ID)
    ? [GRAPH_API_BASE_HTTP_LOCAL, GRAPH_API_BASE_WS_LOCAL]
    : [GRAPH_API_BASE_HTTP, GRAPH_API_BASE_WS]
}

export default function endpoints() {
  const [API_BASE_HTTP, API_BASE_WS] = getAPIBase()
  const networkName = getNetworkName(CHAIN_ID)

  const API_PATH = `${GRAPH_API_PATH}-${networkName}`

  return [`${API_BASE_HTTP}${API_PATH}`, `${API_BASE_WS}${API_PATH}`]
}

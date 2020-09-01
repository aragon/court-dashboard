import environment from './environment'

import { isLocalOrUnknownNetwork, getNetworkType } from './lib/web3-utils'
import { getNetworkConfig } from './networks'
import {
  getDefaultEthNode,
  getIpfsGateway,
  getSubgraphHttpEndpoint,
} from './local-settings'

const CHAIN_ID = environment('CHAIN_ID')
const COURT_SERVER_NAME = environment('COURT_SERVER_NAME')

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
  return `https://court${
    networkType === 'main' ? '' : `-${COURT_SERVER_NAME || networkType}`
  }.backend.aragon.org`
}

export function graphEndpoint() {
  const { nodes } = getNetworkConfig()
  return nodes.subgraph
}

export const defaultEthNode =
  getDefaultEthNode() || getNetworkConfig().nodes.defaultEth

export const defaultIpfsGateway = getIpfsGateway()

export const defaultSubgraphHttpEndpoint = getSubgraphHttpEndpoint()

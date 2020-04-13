import env from './environment'
import endpoints, { IPFS_ENDPOINT } from './endpoints'

const DEFAULT_ETH_NODE = 'DEFAULT_ETH_NODE'
const IPFS_GATEWAY = 'IPFS_GATEWAY'
const CUSTOM_SUBGRAPH_ENDPOINT = 'CUSTOM_SUBGRAPH_ENDPOINT'
const [GRAPH_API_ENDPOINT_HTTP] = endpoints()

// Get a setting from localStorage
function getLocalStorageSetting(confKey) {
  const storageKey = `${confKey}_KEY`
  return window.localStorage.getItem(storageKey)
}

// Get a local setting: from the local storage if available, or the env vars.
function getLocalSetting(confKey) {
  return getLocalStorageSetting(confKey) || env(confKey)
}

function setLocalSetting(confKey, value) {
  const storageKey = `${confKey}_KEY`
  return window.localStorage.setItem(storageKey, value)
}

export function clearLocalStorageNetworkSettings() {
  // TODO - remove subgrapk key once available
  window.localStorage.removeItem('DEFAULT_ETH_NODE_KEY')
  window.localStorage.removeItem('IPFS_GATEWAY_KEY')
  window.localStorage.removeItem('CUSTOM_SUBGRAPH_ENDPOINT_KEY')
}

export function getDefaultEthNode() {
  // Let the network configuration handle node defaults
  return getLocalSetting(DEFAULT_ETH_NODE) || ''
}

export function setDefaultEthNode(node) {
  return setLocalSetting(DEFAULT_ETH_NODE, node)
}

export function setIpfsGateway(gateway) {
  return setLocalSetting(IPFS_GATEWAY, gateway)
}

export function getIpfsGateway() {
  return getLocalSetting(IPFS_GATEWAY) || IPFS_ENDPOINT
}

export function getSubgraphEndpoint() {
  return getLocalSetting(CUSTOM_SUBGRAPH_ENDPOINT) || GRAPH_API_ENDPOINT_HTTP
}

export function setSubgraphEndpoint(endpoint) {
  return setLocalSetting(CUSTOM_SUBGRAPH_ENDPOINT, endpoint)
}

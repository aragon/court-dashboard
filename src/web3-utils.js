const DEFAULT_LOCAL_CHAIN = 'rpc'

export function getNetworkName(chainId) {
  chainId = String(chainId)

  if (chainId === '1') return 'mainnet'
  if (chainId === '3') return 'ropsten'
  if (chainId === '4') return 'rinkeby'

  return DEFAULT_LOCAL_CHAIN
}

export function isLocalOrUnknownNetwork(chainId) {
  return getNetworkName(chainId) === DEFAULT_LOCAL_CHAIN
}

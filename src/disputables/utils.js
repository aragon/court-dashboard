import { getNetworkType, sanitizeNetworkType } from '../lib/web3-utils'
import { DISPUTABLE_SUBGRAPH_URLS } from './mappings'

export function getAragonSubgraph() {
  const networkType = sanitizeNetworkType(getNetworkType())
  return `https://graph.backend.aragon.org/subgraphs/name/aragon/aragon-${networkType}`
}

export function getSubgraphByAppId(appId) {
  const networkType = getNetworkType()
  const subgraphUrls = DISPUTABLE_SUBGRAPH_URLS.get(appId)

  return subgraphUrls ? subgraphUrls[networkType] : ''
}

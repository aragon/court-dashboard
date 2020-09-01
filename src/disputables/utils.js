import { getNetworkType } from '../lib/web3-utils'
import { DISPUTABLE_SUBGRAPH_URLS } from './mappings'

export function getSubgraphByAppId(appId) {
  const networkType = getNetworkType()
  const subgraphUrls = DISPUTABLE_SUBGRAPH_URLS.get(appId)

  return subgraphUrls ? subgraphUrls[networkType] : ''
}

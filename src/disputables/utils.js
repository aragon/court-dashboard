import environment from '../environment'
import { sanitizeNetworkType, getNetworkType } from '../lib/web3-utils'
import { DISPUTABLE_SUBGRAPH_NAMES } from './mappings'

const SUBGRAPH_NAME = environment('SUBGRAPH_NAME')
const GRAPH_API_BASE = 'https://api.thegraph.com'
const GRAPH_API_PATH = '/subgraphs/name/aragon/'

export function getSubgraphByAppId(appId) {
  const networkType = sanitizeNetworkType(getNetworkType())

  const name = DISPUTABLE_SUBGRAPH_NAMES.get(appId)

  return `${GRAPH_API_BASE}${GRAPH_API_PATH}${name}-${networkType}${
    SUBGRAPH_NAME ? `-${SUBGRAPH_NAME}` : ''
  }`
}

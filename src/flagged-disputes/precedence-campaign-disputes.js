import { networks, RINKEBY_COURT, RINKEBY_USABILITY_COURT } from '../networks'
import { getNetworkType } from '../lib/web3-utils'

const PRECEDENCE_CAMPAIGN_DISPUTES = {
  rpc: new Map([[networks.rpc.court, []]]),
  ropsten: new Map([[networks.ropsten.court, []]]),
  rinkeby: new Map([
    [RINKEBY_COURT, []],
    [RINKEBY_USABILITY_COURT, []],
  ]),
  main: new Map([[networks.main.court, []]]),
}

export function getPrecedenceCampaignDisputesByCourt() {
  const networkType = getNetworkType()
  const courtAddress = networks[networkType].court

  return PRECEDENCE_CAMPAIGN_DISPUTES[networkType].get(courtAddress)
}

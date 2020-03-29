import {
  networks,
  getNetwork,
  getInternalNetworkName,
  RINKEBY_COURT,
  RINKEBY_STAGING_COURT,
  RINKEBY_USABILITY_COURT,
} from '../networks'

const PRECEDENCE_CAMPAIGN_DISPUTES = {
  main: new Map([[networks.main.court, new Map([])]]),
  rinkeby: new Map([
    [RINKEBY_COURT, new Map([])],
    [RINKEBY_STAGING_COURT, new Map([['0']])],
    [RINKEBY_USABILITY_COURT, new Map([])],
  ]),
  ropsten: new Map([[networks.ropsten.court, new Map([])]]),
  local: new Map([[networks.local.court, new Map([])]]),
}

export function getPrecedenceCampaignDisputesByCourt() {
  const courtAddress = getNetwork().court

  return PRECEDENCE_CAMPAIGN_DISPUTES[getInternalNetworkName()].get(
    courtAddress
  )
}

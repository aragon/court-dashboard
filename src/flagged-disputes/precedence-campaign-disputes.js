import {
  networks,
  getNetwork,
  getInternalNetworkName,
  RINKEBY_COURT,
  RINKEBY_STAGING_COURT,
  RINKEBY_USABILITY_COURT,
} from '../networks'

const PRECEDENCE_CAMPAIGN_DISPUTES = {
  main: new Map([[networks.main.court, []]]),
  rinkeby: new Map([
    [RINKEBY_COURT, []],
    [RINKEBY_STAGING_COURT, []],
    [RINKEBY_USABILITY_COURT, []],
  ]),
  ropsten: new Map([[networks.ropsten.court, []]]),
  local: new Map([[networks.local.court, ['0']]]),
}

export function getPrecedenceCampaignDisputesByCourt() {
  const courtAddress = getNetwork().court

  return PRECEDENCE_CAMPAIGN_DISPUTES[getInternalNetworkName()].get(
    courtAddress
  )
}

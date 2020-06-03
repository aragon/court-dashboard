import {
  networkConfigs,
  getNetworkConfig,
  getInternalNetworkName,
  RINKEBY_COURT,
  RINKEBY_STAGING_COURT,
} from '../networks'

const PRECEDENCE_CAMPAIGN_DISPUTES = {
  main: new Map([
    [networkConfigs.main.court, new Map([['1'], ['2'], ['3'], ['4'], ['5']])],
  ]),
  rinkeby: new Map([
    [RINKEBY_COURT, new Map([])],
    [RINKEBY_STAGING_COURT, new Map([['0']])],
  ]),
  ropsten: new Map([[networkConfigs.ropsten.court, new Map([])]]),
  local: new Map([[networkConfigs.local.court, new Map([])]]),
}

export function getPrecedenceCampaignDisputesByCourt() {
  const courtAddress = getNetworkConfig().court

  return PRECEDENCE_CAMPAIGN_DISPUTES[getInternalNetworkName()].get(
    courtAddress
  )
}

import {
  networkConfigs,
  getNetworkConfig,
  getInternalNetworkName,
  RINKEBY_COURT,
  RINKEBY_STAGING_COURT,
} from '../networks'

const PRECEDENCE_CAMPAIGN_DISPUTES = {
  main: new Map([
    [
      networkConfigs.main.court,
      new Map(new Array(21).fill().map((_, index) => [String(index + 1)])),
    ],
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

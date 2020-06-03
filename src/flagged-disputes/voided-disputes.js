import {
  networkConfigs,
  getInternalNetworkName,
  getNetworkConfig,
  RINKEBY_COURT,
  RINKEBY_STAGING_COURT,
} from '../networks'
import env from '../environment'

const VOIDED_DISPUTES = {
  main: new Map([
    [
      networkConfigs.main.court,
      new Map(
        [
          {
            id: '0',
            link:
              'https://blog.aragon.one/update-on-aragon-courts-first-mock-dispute/',
            description:
              'Dispute #0 is void and all related content has been removed from the Dashboard. Aragon One has made the decision to void the dispute and consider it non-existent when considering precedence for future Aragon Court cases.',
            text: 'This dispute has been voided and discontinued',
          },
        ].map(dispute => [dispute.id, dispute])
      ),
    ],
  ]),
  rinkeby: new Map([
    [RINKEBY_COURT, new Map([])],
    [RINKEBY_STAGING_COURT, new Map([])],
  ]),
  ropsten: new Map([[networkConfigs.ropsten.court, new Map([])]]),
  local: new Map([[networkConfigs.local.court, new Map([])]]),
}

export function getVoidedDisputesByCourt() {
  if (env('SKIP_VOIDING')) {
    return new Map([])
  }
  const courtAddress = getNetworkConfig().court

  return VOIDED_DISPUTES[getInternalNetworkName()].get(courtAddress)
}

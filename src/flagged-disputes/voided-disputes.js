import { networks, RINKEBY_COURT, RINKEBY_USABILITY_COURT } from '../networks'
import { getNetworkType } from '../lib/web3-utils'
import env from '../environment'

const VOIDED_DISPUTES = {
  rpc: new Map([[networks.rpc.court, new Map([])]]),
  ropsten: new Map([[networks.ropsten.court, new Map([])]]),
  rinkeby: new Map([
    [RINKEBY_COURT, new Map([])],
    [RINKEBY_USABILITY_COURT, new Map([])],
  ]),
  main: new Map([
    [
      networks.main.court,
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
}

export function getVoidedDisputesByCourt() {
  if (env('SKIP_VOIDING')) {
    return new Map([])
  }

  const networkType = getNetworkType()
  const courtAddress = networks[networkType].court

  return VOIDED_DISPUTES[networkType].get(courtAddress)
}

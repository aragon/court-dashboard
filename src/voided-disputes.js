import {
  networkConfigs,
  RINKEBY_COURT,
  RINKEBY_USABILITY_COURT,
} from './networks'
import { getNetworkType } from './lib/web3-utils'
import env from './environment'

// TODO: Add text and link when available
const DEFAULT_VOID_LINK =
  'https://blog.aragon.one/update-on-aragon-courts-first-mock-dispute/'
const DEFAULT_VOID_TEXT = 'This dispute has been voided and discontinued'
const DEFAULT_VOID_DESCRIPTION =
  'Dispute #0 is void and all related content has been removed from the Dashboard. Aragon One has made the decision to void the dispute and consider it non-existent when considering precedence for future Aragon Court cases.'

const VOIDED_DISPUTES = {
  rpc: new Map([[networkConfigs.rpc.court, new Map([])]]),
  ropsten: new Map([[networkConfigs.ropsten.court, new Map([])]]),
  rinkeby: new Map([
    [RINKEBY_COURT, new Map([])],
    [RINKEBY_USABILITY_COURT, new Map([])],
  ]),
  main: new Map([
    [
      networkConfigs.main.court,
      new Map(
        [
          {
            id: '0',
            link: DEFAULT_VOID_LINK,
            description: DEFAULT_VOID_DESCRIPTION,
            text: DEFAULT_VOID_TEXT,
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
  const courtAddress = networkConfigs[networkType].court

  return VOIDED_DISPUTES[networkType].get(courtAddress)
}

import { networks, RINKEBY_COURT, RINKEBY_USABILITY_COURT } from './networks'
import { getNetworkName } from './lib/web3-utils'
import env from './environment'

// TODO: Add text and link when available
const DEFAULT_VOID_LINK = ''
const DEFAULT_VOID_TEXT = ''
const DEFAULT_VOID_DESCRIPTION = 'This dispute has been voided and discontinued'

const VOIDED_DISPUTES = {
  rpc: new Map([[networks.rpc.court, new Map([])]]),
  ropsten: new Map([[networks.ropsten.court, new Map([])]]),
  rinkeby: new Map([
    [RINKEBY_COURT, new Map([])],
    [RINKEBY_USABILITY_COURT, new Map([])],
  ]),
  mainnet: new Map([
    [
      networks.mainnet.court,
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

  const networkName = getNetworkName(env('CHAIN_ID'))
  const courtAddress = networks[networkName].court

  return VOIDED_DISPUTES[networkName].get(courtAddress)
}

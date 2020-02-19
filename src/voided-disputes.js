import { networks, RINKEBY_COURT, RINKEBY_USABILITY_COURT } from './networks'
import { getNetworkName } from './lib/web3-utils'
import env from './environment'

const DEFAULT_VOID_TEXT = 'This is a text'
const DEFAULT_VOID_LINK = ''

export const VOIDED_DISPUTES = {
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
            text: DEFAULT_VOID_TEXT,
            link: DEFAULT_VOID_LINK,
            // TODO: Add texts and links when available
          },
        ].map(dispute => [dispute.id, dispute])
      ),
    ],
  ]),
}

export function getVoidedDisputesByCourt() {
  const networkName = getNetworkName(env('CHAIN_ID'))
  const courtAddress = networks[networkName].court

  return VOIDED_DISPUTES[networkName].get(courtAddress)
}

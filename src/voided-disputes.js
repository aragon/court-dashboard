import { networks, RINKEBY_COURT, RINKEBY_USABILITY_COURT } from './networks'
import { getNetworkName } from './lib/web3-utils'
import env from './environment'

const DEFAULT_VOID_TEXT = ''
const DEFAULT_VOID_LINK = ''

export const VoidedDisputes = {
  rpc: new Map([[networks.rpc.court, []]]),
  ropsten: new Map([[networks.ropsten.court, []]]),
  rinkeby: new Map([
    [RINKEBY_COURT, []],
    [RINKEBY_USABILITY_COURT, []],
  ]),
  mainnet: new Map([
    [
      networks.mainnet.court,
      [
        {
          id: '0',
          text: DEFAULT_VOID_TEXT,
          link: DEFAULT_VOID_LINK,
        },
      ],
    ],
  ]),
}

export function getVoidedDisputesByCourt() {
  const networkName = getNetworkName(env('CHAIN_ID'))
  const courtAddress = networks[networkName].court

  return VoidedDisputes[networkName].get(courtAddress)
}

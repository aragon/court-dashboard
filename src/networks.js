import environment from './environment'
import { getNetworkType } from './lib/web3-utils'
import { getDefaultEthNode, getIpfsGateway } from './local-settings'

const SUBGRAPH_NAME = environment('SUBGRAPH_NAME')

export const RINKEBY_COURT = '0xb5ffbe75fa785725eea5f931b64fc04e516c9c5d'
export const RINKEBY_USABILITY_COURT =
  '0x44f788370206696b20B94BC77c4f73Ca264aa05E'

export const networkConfigs = {
  rpc: {
    court: '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550',
    nodes: {
      defaultEth: 'http://localhost:8545',
    },
  },
  main: {
    court: '0xee4650cBe7a2B23701D416f58b41D8B76b617797',
    nodes: {
      defaultEth: 'wss://mainnet.eth.aragon.network/ws',
    },
  },
  rinkeby: {
    court:
      SUBGRAPH_NAME === 'usability' ? RINKEBY_USABILITY_COURT : RINKEBY_COURT,
    nodes: {
      defaultEth: 'wss://rinkeby.eth.aragon.network/ws',
    },
  },
  ropsten: {
    court: '0x3b26bc496aebaed5b3E0E81cDE6B582CDe71396e',
    nodes: {
      defaultEth: 'wss://ropsten.eth.aragon.network/ws',
    },
  },
}

export function getNetworkConfig(chainId) {
  return networkConfigs[chainId]
}

export const defaultEthNode =
  getDefaultEthNode() ||
  networkConfigs[getNetworkType(environment('CHAIN_ID'))].nodes.defaultEth

export const defaultIpfsGateway = getIpfsGateway()

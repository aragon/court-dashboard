import environment from './environment'
import { getNetworkType } from './lib/web3-utils'

const SUBGRAPH_NAME = environment('SUBGRAPH_NAME')

export const RINKEBY_COURT = '0xb5ffbe75fa785725eea5f931b64fc04e516c9c5d'
export const RINKEBY_USABILITY_COURT =
  '0x44f788370206696b20B94BC77c4f73Ca264aa05E'

export const networks = {
  local: { court: '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550' },
  ropsten: { court: '0x3b26bc496aebaed5b3E0E81cDE6B582CDe71396e' },
  rinkeby: {
    // Use the 'usability' Court address if declared
    court:
      SUBGRAPH_NAME === 'usability' ? RINKEBY_USABILITY_COURT : RINKEBY_COURT,
  },
  main: {
    court: '0xee4650cBe7a2B23701D416f58b41D8B76b617797',
    network_agent: '0x5e8c17a6065c35b172b10e80493d2266e2947df4',
    network_reserve: '0xec0dd1579551964703246becfbf199c27cb84485',
  },
}

export const networkConfigs = {
  local: {
    nodes: {
      defaultEth: 'http://localhost:8545',
    },
  },
  main: {
    nodes: {
      defaultEth: 'https://mainnet.eth.aragon.network/',
    },
  },
  rinkeby: {
    nodes: {
      defaultEth: 'https://rinkeby.eth.aragon.network/',
    },
  },
}

export function getNetworkConfig(chainId) {
  return networkConfigs[chainId]
}

export const networkAgentAddress =
  networks[getNetworkType(environment('CHAIN_ID'))].network_agent

export const networkReserveAddress =
  networks[getNetworkType(environment('CHAIN_ID'))].network_reserve

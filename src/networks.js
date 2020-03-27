import environment from './environment'
import { getNetworkType, isLocalOrUnknownNetwork } from './lib/web3-utils'

const SUBGRAPH_NAME = environment('SUBGRAPH_NAME')

export const RINKEBY_COURT = '0xb5ffbe75fa785725eea5f931b64fc04e516c9c5d'
export const RINKEBY_USABILITY_COURT =
  '0x44f788370206696b20B94BC77c4f73Ca264aa05E'

export const RINKEBY_STAGING_COURT =
  '0x52180Af656A1923024D1ACcF1D827AB85cE48878'

export const networks = {
  main: {
    court: '0xee4650cBe7a2B23701D416f58b41D8B76b617797',
    network_agent: '0x5e8c17a6065c35b172b10e80493d2266e2947df4',
    network_reserve: '0xec0dd1579551964703246becfbf199c27cb84485',
  },
  rinkeby: {
    // Use the 'usability' or 'staging' Court address if declared
    court: getRinkebyCourtAddress(SUBGRAPH_NAME),
  },
  ropsten: { court: '0x3b26bc496aebaed5b3E0E81cDE6B582CDe71396e' },
  local: { court: '0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb' },
}

export const networkConfigs = {
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
  ropsten: {
    nodes: {
      defaultEth: 'https://ropsten.eth.aragon.network/',
    },
  },
  local: {
    nodes: {
      defaultEth: 'http://localhost:8545',
    },
  },
}

export function getInternalNetworkName() {
  return isLocalOrUnknownNetwork() ? 'local' : getNetworkType()
}

export function getNetwork() {
  return networks[getInternalNetworkName()]
}

export function getNetworkConfig() {
  return networkConfigs[getInternalNetworkName()]
}

export const networkAgentAddress = getNetwork().network_agent

export const networkReserveAddress = getNetwork().network_reserve

function getRinkebyCourtAddress(subGraphName) {
  if (subGraphName === 'usability') {
    return RINKEBY_USABILITY_COURT
  }
  if (subGraphName === 'staging') {
    return RINKEBY_STAGING_COURT
  }
  return RINKEBY_COURT
}

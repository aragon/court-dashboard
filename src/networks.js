import environment from './environment'

const SUBGRAPH_NAME = environment('SUBGRAPH_NAME')

export const RINKEBY_COURT = '0xb5ffbe75fa785725eea5f931b64fc04e516c9c5d'
export const RINKEBY_USABILITY_COURT =
  '0x44f788370206696b20B94BC77c4f73Ca264aa05E'

export const RINKEBY_STAGING_COURT =
  '0x52180Af656A1923024D1ACcF1D827AB85cE48878'

export const networks = {
  rpc: { court: '0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb' },
  ropsten: { court: '0x3b26bc496aebaed5b3E0E81cDE6B582CDe71396e' },
  rinkeby: {
    // Use the 'usability' Court address if declared
    court: getRinkebyCourtAddress(SUBGRAPH_NAME),
  },
  main: { court: '0xee4650cBe7a2B23701D416f58b41D8B76b617797' },
}

function getRinkebyCourtAddress(subGraphName) {
  if (subGraphName === 'usability') {
    return RINKEBY_USABILITY_COURT
  }
  if (subGraphName === 'staging') {
    return RINKEBY_STAGING_COURT
  }
  return RINKEBY_COURT
}

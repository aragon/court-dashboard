import environment from './environment'

const SUBGRAPH_NAME = environment('SUBGRAPH_NAME')

export const RINKEBY_COURT = '0xb5ffbe75fa785725eea5f931b64fc04e516c9c5d'
export const RINKEBY_USABILITY_COURT =
  '0x44f788370206696b20B94BC77c4f73Ca264aa05E'

export const networks = {
  rpc: { court: '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550' },
  ropsten: { court: '0x3b26bc496aebaed5b3E0E81cDE6B582CDe71396e' },
  rinkeby: {
    // Use the 'usability' Court address if declared
    court:
      SUBGRAPH_NAME === 'usability' ? RINKEBY_USABILITY_COURT : RINKEBY_COURT,
  },
  main: { court: '0xee4650cBe7a2B23701D416f58b41D8B76b617797' },
}

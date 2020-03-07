import env from '../environment'
import { getNetworkType } from '../lib/web3-utils'

export const KNOWN_TOKEN_BY_ENV = {
  DAI: {
    main: {
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      decimals: 18,
    },
  },
}

export function getKnownToken(symbol) {
  return KNOWN_TOKEN_BY_ENV[symbol][getNetworkType(env('CHAIN_ID'))]
}

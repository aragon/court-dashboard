import env from '../environment'
import { getNetworkName } from '../lib/web3-utils'

export const KNOWN_TOKEN_ADDRESS_BY_ENV = {
  DAI: {
    mainnet: '0x6b175474e89094c44da98b954eedeac495271d0f',
  },
}

export function getTokenAddress(symbol) {
  return KNOWN_TOKEN_ADDRESS_BY_ENV[symbol][getNetworkName(env('CHAIN_ID'))]
}

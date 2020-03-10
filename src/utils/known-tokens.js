import env from '../environment'
import { getNetworkType } from '../lib/web3-utils'

export const KNOWN_TOKEN_BY_ENV = {
  ANJ: {
    mainnet: {
      address: '0xcD62b1C403fa761BAadFC74C525ce2B51780b184',
      decimals: 18,
      symbol: 'ANJ',
    },
    rpc: {
      address: '0xcD62b1C403fa761BAadFC74C525ce2B51780b184',
      decimals: 18,
      symbol: 'ANJ',
    },
  },
  ANT: {
    mainnet: {
      address: '0x960b236A07cf122663c4303350609A66A7B288C0',
      decimals: 18,
      symbol: 'ANT',
    },
    rpc: {
      address: '0x960b236A07cf122663c4303350609A66A7B288C0',
      decimals: 18,
      symbol: 'ANT',
    },
  },
  DAI: {
    main: {
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      decimals: 18,
      symbol: 'DAI',
    },
    rpc: {
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      decimals: 18,
      symbol: 'DAI',
    },
  },
}

export function getKnownToken(symbol) {
  return KNOWN_TOKEN_BY_ENV[symbol][getNetworkType(env('CHAIN_ID'))]
}

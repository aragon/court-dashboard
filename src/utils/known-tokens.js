import { getInternalNetworkName } from '../networks'

export const KNOWN_TOKEN_BY_ENV = {
  ANJ: {
    main: {
      address: '0xcD62b1C403fa761BAadFC74C525ce2B51780b184',
      decimals: 18,
      symbol: 'ANJ',
    },
    rinkeby: {
      address: '0x1FAB7d0D028ded72195322998003F6e82cF4cFdB',
      decimals: 18,
      symbol: 'ANJ',
    },
    ropsten: {
      address: '0xc863E1CcC047befF17022F4229DBE6321A6BCe65',
      decimals: 18,
      symbol: 'ANJ',
    },
    local: {
      address: '0xcD62b1C403fa761BAadFC74C525ce2B51780b184',
      decimals: 18,
      symbol: 'ANJ',
    },
  },
  ANT: {
    main: {
      address: '0x960b236A07cf122663c4303350609A66A7B288C0',
      decimals: 18,
      symbol: 'ANT',
    },
    rinkeby: {
      address: '0x8cf8196c14A654dc8Aceb3cbb3dDdfd16C2b652D',
      decimals: 18,
      symbol: 'ANT',
    },
    ropsten: {
      address: '0x0cb95D9537c8Fb0C947eD48FDafc66A7b72EfC86',
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
    rinkeby: {
      address: '0xe9A083D88Eed757B1d633321Ce0519F432c6284d',
      decimals: 18,
      symbol: 'DAI',
    },
    ropsten: {
      address: '0x4E1F48Db14D7E1ada090c42ffE15FF3024EEc8Bf',
      decimals: 18,
      symbol: 'DAI',
    },
    local: {
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      decimals: 18,
      symbol: 'DAI',
    },
  },
}

export function getKnownToken(symbol) {
  return KNOWN_TOKEN_BY_ENV[symbol][getInternalNetworkName()]
}

import env from '../environment'
import { getNetworkName } from '../lib/web3-utils'

export const KNOWN_DAI_ADDRESS_BY_ENV = {
  mainnet: '0x6b175474e89094c44da98b954eedeac495271d0f',
}

export function getDaiAddress() {
  return KNOWN_DAI_ADDRESS_BY_ENV[getNetworkName(env('CHAIN_ID'))]
}
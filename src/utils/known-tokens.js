import env from '../environment'

export const KNOWN_DAI_ADDRESS_BY_ENV = new Map([
  ['1', '0x6b175474e89094c44da98b954eedeac495271d0f'],
  ['4', '0xe9A083D88Eed757B1d633321Ce0519F432c6284d'],
])

export function getDaiAddress() {
  return KNOWN_DAI_ADDRESS_BY_ENV.get(String(env('CHAIN_ID')))
}

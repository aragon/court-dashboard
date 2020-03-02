import env from '../environment'

export const KNOWN_ANT_ADDRESS_BY_ENV = new Map([
  ['1', '0x960b236A07cf122663c4303350609A66A7B288C0'],
  ['4', '0xbf932fdf8d600398d64614ef9a10401ff046f449'],
])

export function getANTAddress() {
  return KNOWN_ANT_ADDRESS_BY_ENV.get(String(env('CHAIN_ID')))
}

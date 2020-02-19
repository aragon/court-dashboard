import { getNetworkName } from '../lib/web3-utils'
import env from '../environment'

export default function useNetwork() {
  const networkType = getNetworkName(env('CHAIN_ID'))

  return {
    type: networkType === 'mainnet' ? 'main' : networkType,
  }
}

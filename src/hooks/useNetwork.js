import { getNetworkType } from '../lib/web3-utils'

export default function useNetwork() {
  const networkType = getNetworkType()
  return {
    type: networkType === 'mainnet' ? 'main' : networkType,
  }
}

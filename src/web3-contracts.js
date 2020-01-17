import { useMemo } from 'react'

import { Contract as EthersContract } from 'ethers'
import { useWeb3Connect } from './providers/Web3'

const contractsCache = new Map()

export function useContract(address, abi, signer = true) {
  const { ethersProvider } = useWeb3Connect()

  // We need this value as a dependency of memo for uses cases when the  user changes account
  const accountSigner = ethersProvider && ethersProvider.getSigner()

  return useMemo(() => {
    if (!address || !ethersProvider) {
      return null
    }

    // TODO: clear the cache when the provider changes
    if (contractsCache.has(address)) {
      return contractsCache.get(address)
    }

    const contract = new EthersContract(
      address,
      abi,
      signer ? accountSigner : ethersProvider
    )

    contractsCache.set(address, contract)

    return contract
  }, [abi, accountSigner, address, ethersProvider, signer])
}

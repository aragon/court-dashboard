import { useMemo } from 'react'

import { Contract as EthersContract } from 'ethers'
import { useWeb3Connect } from './providers/Web3'

export function useContract(address, abi, signer = true) {
  const { account, ethersProvider } = useWeb3Connect()

  return useMemo(() => {
    // Apparaently .getSigner() returns a new object every time so we use the connected account as memo dependency
    if (!address || !ethersProvider || !account) {
      return null
    }

    return new EthersContract(
      address,
      abi,
      signer ? ethersProvider.getSigner() : ethersProvider
    )
  }, [abi, account, address, ethersProvider, signer])
}

import { useMemo } from 'react'
import { Contract as EthersContract, providers as Providers } from 'ethers'
import { useWallet } from './providers/Wallet'
import { defaultEthNode } from './networks'

export function useContract(address, abi, signer = true) {
  const { account, ethers } = useWallet()

  return useMemo(() => {
    // Apparently .getSigner() returns a new object every time, so we use the
    // connected account as memo dependency.

    if (!address || !ethers || !account) {
      return null
    }

    return new EthersContract(
      address,
      abi,
      signer ? ethers.getSigner() : ethers
    )
  }, [abi, account, address, ethers, signer])
}

export function useContractReadOnly(address, abi) {
  return useMemo(() => {
    const provider = new Providers.JsonRpcProvider(defaultEthNode)
    return new EthersContract(address, abi, provider)
  }, [abi, address])
}

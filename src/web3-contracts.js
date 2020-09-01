import { useMemo } from 'react'
import { Contract as EthersContract, providers as Providers } from 'ethers'
import { useWallet } from './providers/Wallet'
import { defaultEthNode } from './endpoints'

const DEFAULT_PROVIDER = new Providers.JsonRpcProvider(defaultEthNode)

export function useContract(address, abi, signer = true) {
  const { account, ethers } = useWallet()

  return useMemo(() => {
    // Apparently .getSigner() returns a new object every time, so we use the
    // connected account as memo dependency.

    if (!address || !ethers || !account) {
      return null
    }

    return getContract(address, abi, signer ? ethers.getSigner() : ethers)
  }, [abi, account, address, ethers, signer])
}

export function useContractReadOnly(address, abi) {
  return useMemo(() => {
    if (!address) {
      return null
    }
    return getContract(address, abi)
  }, [abi, address])
}

export function getContract(address, abi, provider = DEFAULT_PROVIDER) {
  return new EthersContract(address, abi, provider)
}

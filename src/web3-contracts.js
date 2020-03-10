import { useMemo } from 'react'
import { Contract as EthersContract, providers as Providers } from 'ethers'
import { useWallet } from './providers/Wallet'
import { getNetworkType } from './lib/web3-utils'
import { networkConfigs } from './networks'

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
  const ethEndpoint = networkConfigs[getNetworkType()].nodes.defaultEth

  return useMemo(() => {
    const provider = new Providers.JsonRpcProvider(ethEndpoint)
    return new EthersContract(address, abi, provider)
  }, [abi, address, ethEndpoint])
}

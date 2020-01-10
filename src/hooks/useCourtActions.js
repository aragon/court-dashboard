import { useCallback } from 'react'

import { useCourtConfig } from '../providers/CourtConfig'
import { CourtModuleType } from '../types/court-module-types'
import { useContract } from '../web3-contracts'

import jurorRegistryAbi from '../abi/JurorRegistry.json'
import tokenAbi from '../abi/ERC20.json'

import { getFunctionSignature } from '../lib/web3'

const ACTIVATE_SELECTOR = getFunctionSignature('activate(uint256)')
console.log(ACTIVATE_SELECTOR)

function useJurorRegistryContract() {
  const { modules } = useCourtConfig()

  const jurorRegistryModule = modules.find(
    mod => CourtModuleType[mod.type] === CourtModuleType.JurorsRegistry
  )

  const jurorRegistryAddress = jurorRegistryModule
    ? jurorRegistryModule.address
    : null

  return useContract(jurorRegistryAddress, jurorRegistryAbi)
}

function useANJTokenContract() {
  const { anjToken } = useCourtConfig()

  const anjTokenAddress = anjToken ? anjToken.id : null

  return useContract(anjTokenAddress, tokenAbi)
}

export function useANJActions() {
  const jurorRegistryContract = useJurorRegistryContract()
  const anjTokenContract = useANJTokenContract()

  // activate ANJ directly from available balance
  const activateANJ = useCallback(
    amount => {
      return jurorRegistryContract.activate(amount, { gasLimit: 1000000 })
    },
    [jurorRegistryContract]
  )

  // approve, stake and activate ANJ
  const stakeActivateANJ = useCallback(
    amount => {
      return anjTokenContract.approveAndCall(
        jurorRegistryContract.address,
        amount,
        ACTIVATE_SELECTOR,
        { gasLimit: 1000000 }
      )
    },
    [anjTokenContract, jurorRegistryContract]
  )

  return { activateANJ, stakeActivateANJ }
}

export function useCourtActions() {
  const anjActions = useANJActions()

  return {
    ...anjActions,
  }
}

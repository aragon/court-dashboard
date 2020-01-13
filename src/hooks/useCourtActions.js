import { useCallback } from 'react'

import { useCourtConfig } from '../providers/CourtConfig'
import { CourtModuleType } from '../types/court-module-types'
import { useContract } from '../web3-contracts'

import jurorRegistryAbi from '../abi/JurorRegistry.json'
import tokenAbi from '../abi/ERC20.json'

import { getFunctionSignature } from '../lib/web3'

const ACTIVATE_SELECTOR = getFunctionSignature('activate(uint256)')
const GAS_LIMIT = 500000 // Should be relative to every tx ?

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
      return jurorRegistryContract.activate(amount, { gasLimit: GAS_LIMIT })
    },
    [jurorRegistryContract]
  )

  const deactivateANJ = useCallback(
    amount => {
      return jurorRegistryContract.deactivate(amount, { gasLimit: GAS_LIMIT })
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
        { gasLimit: GAS_LIMIT }
      )
    },
    [anjTokenContract, jurorRegistryContract]
  )

  const withdrawANJ = useCallback(
    amount => {
      return jurorRegistryContract.unstake(amount, '0x', {
        gasLimit: GAS_LIMIT,
      })
    },
    [jurorRegistryContract]
  )

  return { activateANJ, deactivateANJ, stakeActivateANJ, withdrawANJ }
}

export function useCourtActions() {
  const anjActions = useANJActions()

  return {
    ...anjActions,
  }
}

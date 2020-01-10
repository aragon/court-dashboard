import { useCallback } from 'react'

import { useCourtConfig } from '../providers/CourtConfig'
import { CourtModuleType } from '../types/court-module-types'
import { useContract } from '../web3-contracts'

import jurorRegistryAbi from '../abi/JurorRegistry.json'

export function useJurorRegistry() {
  const { modules } = useCourtConfig()

  const jurorRegistryModule = modules.find(
    mod => CourtModuleType[mod.type] === CourtModuleType.JurorsRegistry
  )

  const jurorRegistryAddress = jurorRegistryModule
    ? jurorRegistryModule.address
    : null

  const jurorRegistryContract = useContract(
    jurorRegistryAddress,
    jurorRegistryAbi
  )

  const activateANJ = useCallback(
    amount => {
      return jurorRegistryContract.activate(amount, { gasLimit: 1000000 })
    },
    [jurorRegistryContract]
  )

  return { activateANJ }
}

export function useCourtActions() {
  const jurorRegistryActions = useJurorRegistry()

  return {
    ...jurorRegistryActions,
  }
}

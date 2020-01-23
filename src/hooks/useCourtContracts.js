import { useCallback } from 'react'

import { useCourtConfig } from '../providers/CourtConfig'
import { CourtModuleType } from '../types/court-module-types'
import { useContract } from '../web3-contracts'

import aragonCourtAbi from '../abi/AragonCourt.json'
import jurorRegistryAbi from '../abi/JurorRegistry.json'
import tokenAbi from '../abi/ERC20.json'
import disputeManagerAbi from '../abi/DisputeManager.json'
import votingAbi from '../abi/CRVoting.json'

import { getFunctionSignature } from '../lib/web3-utils'
import {
  getVoteId,
  hashVote,
  getOutcomeFromCommitment,
  DEFAULT_SALT,
} from '../utils/crvoting-utils'

const ACTIVATE_SELECTOR = getFunctionSignature('activate(uint256)')
const GAS_LIMIT = 500000 // Should be relative to every tx ?

// ANJ contract
function useANJTokenContract() {
  const { anjToken } = useCourtConfig()

  const anjTokenAddress = anjToken ? anjToken.id : null

  return useContract(anjTokenAddress, tokenAbi)
}

// Court contracts
function useCourtContract(moduleType, abi) {
  const { id, modules } = useCourtConfig()

  let contractAddress
  if (moduleType === CourtModuleType.AragonCourt) {
    contractAddress = id
  } else {
    const courtModule = modules.find(
      mod => CourtModuleType[mod.type] === moduleType
    )

    contractAddress = courtModule ? courtModule.address : null
  }

  return useContract(contractAddress, abi)
}

function useANJActions() {
  const jurorRegistryContract = useCourtContract(
    CourtModuleType.JurorsRegistry,
    jurorRegistryAbi
  )
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

export function useDisputeActions() {
  const disputeManagerContract = useCourtContract(
    CourtModuleType.DisputeManager,
    disputeManagerAbi
  )
  const votingContract = useCourtContract(CourtModuleType.Voting, votingAbi)

  const aragonCourtContract = useCourtContract(
    CourtModuleType.AragonCourt,
    aragonCourtAbi
  )

  // Draft jurors
  const draft = useCallback(
    disputeId => {
      return disputeManagerContract.draft(disputeId, { gasLimit: GAS_LIMIT })
    },
    [disputeManagerContract]
  )

  // Commit
  const commit = useCallback(
    (disputeId, roundId, commitment) => {
      const voteId = getVoteId(disputeId, roundId)
      const hashedCommitment = hashVote(commitment)

      return votingContract.commit(voteId, hashedCommitment)
    },
    [votingContract]
  )

  // Reveal
  const reveal = useCallback(
    (disputeId, roundId, voter, commitment, salt) => {
      const voteId = getVoteId(disputeId, roundId)
      const outcome = getOutcomeFromCommitment(commitment, salt)

      return votingContract.reveal(voteId, voter, outcome, salt || DEFAULT_SALT) // TODO: use salt generated for the juror
    },
    [votingContract]
  )

  // Leak
  const leak = useCallback(
    (disputeId, roundId, voter, outcome, salt) => {
      const voteId = getVoteId(disputeId, roundId)
      return votingContract.leak(voteId, voter, outcome, salt)
    },
    [votingContract]
  )

  // Appeal round of dispute
  const appeal = useCallback(
    (disputeId, roundId, ruling) => {
      return disputeManagerContract.createAppeal(disputeId, roundId, ruling)
    },
    [disputeManagerContract]
  )

  // Confirm appeal round of dispute
  const confirmAppeal = useCallback(
    (disputeId, round, ruling) => {
      return disputeManagerContract.confirmAppeal(disputeId, round, ruling)
    },
    [disputeManagerContract]
  )

  const executeRuling = useCallback(
    disputeId => {
      return aragonCourtContract.executeRuling(disputeId, {
        gasLimit: GAS_LIMIT,
      })
    },
    [aragonCourtContract]
  )
  return { draft, commit, reveal, leak, appeal, confirmAppeal, executeRuling }
}

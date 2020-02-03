import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useCourtConfig } from '../providers/CourtConfig'
import { CourtModuleType } from '../types/court-module-types'
import { useContract } from '../web3-contracts'

import jurorRegistryAbi from '../abi/JurorRegistry.json'
import tokenAbi from '../abi/ERC20.json'
import disputeManagerAbi from '../abi/DisputeManager.json'
import votingAbi from '../abi/CRVoting.json'

import { getFunctionSignature } from '../lib/web3-utils'
import { bigNum } from '../lib/math-utils'
import { getVoteId } from '../utils/crvoting-utils'
import { getModuleAddress } from '../utils/court-utils'

const ACTIVATE_SELECTOR = getFunctionSignature('activate(uint256)')
const GAS_LIMIT = 500000 // Should be relative to every tx ?

function useJurorRegistryContract() {
  const { modules } = useCourtConfig()

  const jurorRegistryModule = useMemo(
    () =>
      modules.find(
        mod => CourtModuleType[mod.type] === CourtModuleType.JurorsRegistry
      ),
    [modules]
  )

  const jurorRegistryAddress = jurorRegistryModule
    ? jurorRegistryModule.address
    : null

  return useContract(jurorRegistryAddress, jurorRegistryAbi)
}

// ANJ contract
function useANJTokenContract() {
  const { anjToken } = useCourtConfig()

  const anjTokenAddress = anjToken ? anjToken.id : null

  return useContract(anjTokenAddress, tokenAbi)
}

// Fee token contract
function useFeeTokenContract() {
  const { feeToken } = useCourtConfig()

  const feeTokenAddress = feeToken ? feeToken.id : null

  return useContract(feeTokenAddress, tokenAbi)
}

// Court contracts
function useCourtContract(moduleType, abi) {
  const { modules } = useCourtConfig()

  const courtModule = modules.find(
    mod => CourtModuleType[mod.type] === moduleType
  )

  const contractAddress = courtModule ? courtModule.address : null

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
      return votingContract.commit(voteId, commitment)
    },
    [votingContract]
  )

  // Reveal
  const reveal = useCallback(
    (disputeId, roundId, voter, outcome, salt) => {
      const voteId = getVoteId(disputeId, roundId)
      return votingContract.reveal(voteId, voter, outcome, salt)
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
      return disputeManagerContract.appeal(disputeId, roundId, ruling, {
        gasLimit: GAS_LIMIT,
      })
    },
    [disputeManagerContract]
  )

  // Confirm appeal round of dispute
  const confirmAppeal = useCallback(
    (disputeId, round, ruling) => {
      return disputeManagerContract.confirmAppeal(disputeId, round, ruling, {
        gasLimit: GAS_LIMIT,
      })
    },
    [disputeManagerContract]
  )

  return { draft, commit, reveal, leak, appeal, confirmAppeal }
}

/**
 *
 * @param {string} disputeId id of the dispute
 * @param {string} roundId id of the round
 * @returns {Object} appeal deposit and confirm appeal deposit amounts
 */
export function useAppealDeposits(disputeId, roundId) {
  const [appealDeposits, setAppealDeposits] = useState([bigNum(0), bigNum(0)])

  const disputeManagerContract = useCourtContract(
    CourtModuleType.DisputeManager,
    disputeManagerAbi
  )

  useEffect(() => {
    const getNextRoundDetails = async () => {
      if (!disputeManagerContract) return
      const nextRound = await disputeManagerContract.getNextRoundDetails(
        disputeId,
        roundId
      )

      const appealDeposit = nextRound[6]
      const confirmAppealDeposit = nextRound[7]
      setAppealDeposits([appealDeposit, confirmAppealDeposit])
    }

    getNextRoundDetails()
  }, [disputeId, disputeManagerContract, roundId])

  return appealDeposits
}

export function useFeeBalanceOf(account) {
  const [balance, setBalance] = useState(bigNum(0))

  const feeTokenContract = useFeeTokenContract()

  useEffect(() => {
    const getFeeBalance = async () => {
      if (!feeTokenContract) return

      const balance = await feeTokenContract.balanceOf(account)
      setBalance(balance)
    }

    getFeeBalance()
  }, [account, feeTokenContract])

  return balance
}

export function useAppealFeeAllowance(owner) {
  const [allowance, setAllowance] = useState(bigNum(0))

  const courtConfig = useCourtConfig()
  const disputeManagerAddress = getModuleAddress(
    courtConfig.modules,
    CourtModuleType.DisputeManager
  )
  const feeTokenContract = useFeeTokenContract()

  useEffect(() => {
    const getFeeAllowance = async () => {
      if (!feeTokenContract) return

      const allowance = await feeTokenContract.allowance(
        owner,
        disputeManagerAddress
      )
      setAllowance(allowance)
    }

    getFeeAllowance()
  }, [disputeManagerAddress, feeTokenContract, owner])

  return allowance
}

export function useTotalActiveBalancePolling(termId) {
  const jurorRegistryContract = useJurorRegistryContract()
  const [totalActiveBalance, setTotalActiveBalance] = useState(bigNum(-1))

  const timeoutId = useRef(null)

  const fetchTotalActiveBalance = useCallback(() => {
    timeoutId.current = setTimeout(() => {
      return jurorRegistryContract
        .totalActiveBalanceAt(termId)
        .then(balance => {
          setTotalActiveBalance(balance)
          fetchTotalActiveBalance()
        })
    }, 500)
  }, [jurorRegistryContract, termId])

  useEffect(() => {
    fetchTotalActiveBalance()

    return () => clearTimeout(timeoutId.current)
  }, [fetchTotalActiveBalance])

  return totalActiveBalance
}

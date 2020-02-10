import { useCallback, useEffect, useRef, useState } from 'react'
import { useCourtConfig } from '../providers/CourtConfig'
import { CourtModuleType } from '../types/court-module-types'
import { useContract } from '../web3-contracts'
import aragonCourtAbi from '../abi/AragonCourt.json'
import jurorRegistryAbi from '../abi/JurorRegistry.json'
import tokenAbi from '../abi/ERC20.json'
import disputeManagerAbi from '../abi/DisputeManager.json'
import votingAbi from '../abi/CRVoting.json'
import { getFunctionSignature } from '../lib/web3-utils'
import { bigNum, formatUnits } from '../lib/math-utils'
import {
  hashVote,
  getOutcomeFromCommitment,
  getVoteId,
  hashPassword,
} from '../utils/crvoting-utils'
import { getModuleAddress } from '../utils/court-utils'
import { retryMax } from '../utils/retry-max'
import { useActivity } from '../providers/Activity'

const ACTIVATE_SELECTOR = getFunctionSignature('activate(uint256)')
const GAS_LIMIT = 1200000 // Should be relative to every tx ?

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
  const { id, modules } = useCourtConfig()

  let contractAddress
  if (moduleType === CourtModuleType.AragonCourt) {
    contractAddress = id
  } else {
    contractAddress = getModuleAddress(modules, moduleType)
  }

  return useContract(contractAddress, abi)
}

/**
 * All ANJ interactions
 * @returns {Object} all available functions around ANJ balances
 */
export function useANJActions() {
  const { addTransactionActivity } = useActivity()
  const jurorRegistryContract = useCourtContract(
    CourtModuleType.JurorsRegistry,
    jurorRegistryAbi
  )
  const anjTokenContract = useANJTokenContract()

  // activate ANJ directly from available balance
  const activateANJ = useCallback(
    async amount => {
      try {
        const tx = await jurorRegistryContract.activate(amount, {
          gasLimit: GAS_LIMIT,
        })
        addTransactionActivity(tx, `Activate ${String(amount)} ANJ`)
        return tx
      } catch (err) {}
    },
    [jurorRegistryContract, addTransactionActivity]
  )

  const deactivateANJ = useCallback(
    async amount => {
      try {
        const tx = jurorRegistryContract.deactivate(amount, {
          gasLimit: GAS_LIMIT,
        })
        addTransactionActivity(tx, `Deactivate ${String(amount)} ANJ`)
        return tx
      } catch (err) {}
    },
    [jurorRegistryContract, addTransactionActivity]
  )

  // approve, stake and activate ANJ
  const stakeActivateANJ = useCallback(
    async amount => {
      try {
        const tx = await anjTokenContract.approveAndCall(
          jurorRegistryContract.address,
          amount,
          ACTIVATE_SELECTOR,
          { gasLimit: GAS_LIMIT }
        )
        addTransactionActivity(
          tx,
          `Stake and activate ${formatUnits(amount)} ANJ`
        )
        return tx
      } catch (err) {}
    },
    [anjTokenContract, jurorRegistryContract, addTransactionActivity]
  )

  const withdrawANJ = useCallback(
    async amount => {
      try {
        const tx = jurorRegistryContract.unstake(amount, '0x', {
          gasLimit: GAS_LIMIT,
        })
        addTransactionActivity(tx, `Withdraw ${String(amount)} ANJ`)
        return tx
      } catch (err) {}
    },
    [jurorRegistryContract, addTransactionActivity]
  )

  return { activateANJ, deactivateANJ, stakeActivateANJ, withdrawANJ }
}

/**
 * All dispute interactions
 * @returns {Object} all available functions around a dispute
 */
export function useDisputeActions() {
  const { addTransactionActivity } = useActivity()
  const disputeManagerContract = useCourtContract(
    CourtModuleType.DisputeManager,
    disputeManagerAbi
  )
  const votingContract = useCourtContract(CourtModuleType.Voting, votingAbi)

  const aragonCourtContract = useCourtContract(
    CourtModuleType.AragonCourt,
    aragonCourtAbi
  )

  const feeTokenContract = useFeeTokenContract()

  // Draft jurors
  const draft = useCallback(
    async disputeId => {
      try {
        const tx = disputeManagerContract.draft(disputeId, {
          gasLimit: GAS_LIMIT,
        })
        addTransactionActivity(tx, `Draft jurors on dispute #${disputeId}`)
        return tx
      } catch (err) {}
    },
    [disputeManagerContract, addTransactionActivity]
  )

  // Commit
  const commit = useCallback(
    async (disputeId, roundId, commitment, password) => {
      const voteId = getVoteId(disputeId, roundId)
      const hashedCommitment = hashVote(commitment, password)

      try {
        const tx = votingContract.commit(voteId, hashedCommitment)
        addTransactionActivity(
          tx,
          `Commit on round ${roundId} of dispute #${disputeId}`
        )
        return tx
      } catch (err) {}
    },
    [votingContract, addTransactionActivity]
  )

  // Reveal
  const reveal = useCallback(
    async (disputeId, roundId, voter, commitment, salt) => {
      const voteId = getVoteId(disputeId, roundId)
      const outcome = getOutcomeFromCommitment(commitment, salt)

      try {
        const tx = votingContract.reveal(
          voteId,
          voter,
          outcome,
          hashPassword(salt)
        )
        addTransactionActivity(
          tx,
          `Reveal vote on round ${roundId} of ${voteId}`
        )
        return tx
      } catch (err) {}
    },
    [votingContract, addTransactionActivity]
  )

  // Leak
  const leak = useCallback(
    async (voteId, voter, outcome, salt) => {
      try {
        const tx = votingContract.leak(voteId, voter, outcome, salt)
        addTransactionActivity(tx, `Leak vote of ${voter} for vote #${voteId}`)
        return tx
      } catch (err) {}
    },
    [votingContract, addTransactionActivity]
  )

  const approveFeeDeposit = useCallback(
    async value => {
      try {
        const tx = feeTokenContract.approve(
          disputeManagerContract.address,
          value
        )
        addTransactionActivity(tx, `Approve fee deposit: ${formatUnits(value)}`)
        return tx
      } catch (err) {}
    },
    [disputeManagerContract, feeTokenContract, addTransactionActivity]
  )

  // Appeal round of dispute
  const appeal = useCallback(
    async (disputeId, roundId, ruling) => {
      try {
        const tx = disputeManagerContract.createAppeal(
          disputeId,
          roundId,
          ruling,
          {
            gasLimit: GAS_LIMIT,
          }
        )
        addTransactionActivity(
          tx,
          `Appeal round ${roundId} of dispute #${disputeId}`
        )
        return tx
      } catch (err) {}
    },
    [disputeManagerContract]
  )

  // Confirm appeal round of dispute
  const confirmAppeal = useCallback(
    async (disputeId, round, ruling) => {
      try {
        const tx = disputeManagerContract.confirmAppeal(
          disputeId,
          round,
          ruling,
          {
            gasLimit: GAS_LIMIT,
          }
        )
        addTransactionActivity(
          tx,
          `Confirm appeal round ${round} of dispute #${disputeId}`
        )
        return tx
      } catch (err) {}
    },
    [disputeManagerContract]
  )

  const executeRuling = useCallback(
    async disputeId => {
      try {
        const tx = aragonCourtContract.executeRuling(disputeId, {
          gasLimit: GAS_LIMIT,
        })
        addTransactionActivity(tx, `Execute ruling for dispute #${disputeId}`)
        return tx
      } catch (err) {}
    },
    [aragonCourtContract, addTransactionActivity]
  )
  return {
    approveFeeDeposit,
    draft,
    commit,
    reveal,
    leak,
    appeal,
    confirmAppeal,
    executeRuling,
  }
}

export function useRewardActions() {
  const disputeManagerContract = useCourtContract(
    CourtModuleType.DisputeManager,
    disputeManagerAbi
  )

  const settleReward = useCallback(
    (disputeId, roundId, juror) => {
      return disputeManagerContract.settleReward(disputeId, roundId, juror, {
        gasLimit: GAS_LIMIT,
      })
    },
    [disputeManagerContract]
  )

  const settleAppealDeposit = useCallback(
    (disputeId, roundId, juror) => {
      return disputeManagerContract.settleAppealDeposit(disputeId, roundId, {
        gasLimit: GAS_LIMIT,
      })
    },
    [disputeManagerContract]
  )

  return { settleReward, settleAppealDeposit }
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
    const fetchNextRoundDetails = async () => {
      if (!disputeManagerContract) {
        return
      }

      retryMax(() =>
        disputeManagerContract
          .getNextRoundDetails(disputeId, roundId)
          .then(nextRound => {
            const appealDeposit = nextRound[6]
            const confirmAppealDeposit = nextRound[7]
            setAppealDeposits([appealDeposit, confirmAppealDeposit])
          })
          .catch(err => {
            console.error(`Error fetching appeal deposits: ${err}`)
          })
      )
    }

    fetchNextRoundDetails()
  }, [disputeId, disputeManagerContract, roundId])

  return appealDeposits
}

export function useFeeBalanceOf(account) {
  const [balance, setBalance] = useState(bigNum(0))

  const feeTokenContract = useFeeTokenContract()

  useEffect(() => {
    const getFeeBalance = async () => {
      if (!feeTokenContract) return

      retryMax(() => feeTokenContract.balanceOf(account))
        .then(balance => {
          setBalance(balance)
        })
        .catch(err => {
          console.error(`Error fetching account's fee balance : ${err}`)
        })
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

      retryMax(() => feeTokenContract.allowance(owner, disputeManagerAddress))
        .then(allowance => {
          setAllowance(allowance)
        })
        .catch(err => {
          console.error(`Error fetching fee allowance : ${err}`)
        })
    }

    getFeeAllowance()
  }, [disputeManagerAddress, feeTokenContract, owner])

  return allowance
}

export function useTotalActiveBalancePolling(termId) {
  const jurorRegistryContract = useCourtContract(
    CourtModuleType.JurorsRegistry,
    jurorRegistryAbi
  )
  const [totalActiveBalance, setTotalActiveBalance] = useState(bigNum(-1))

  const timeoutId = useRef(null)

  const fetchTotalActiveBalance = useCallback(() => {
    timeoutId.current = setTimeout(() => {
      return jurorRegistryContract
        .totalActiveBalanceAt(termId)
        .then(balance => {
          setTotalActiveBalance(balance)
          clearTimeout(timeoutId.current)
          fetchTotalActiveBalance()
        })
        .catch(err => {
          console.log(`Error fetching balance: ${err} retrying...`)
          fetchTotalActiveBalance()
        })
    }, 1000)
  }, [jurorRegistryContract, termId])

  useEffect(() => {
    fetchTotalActiveBalance()

    return () => clearTimeout(timeoutId.current)
  }, [fetchTotalActiveBalance])

  return totalActiveBalance
}

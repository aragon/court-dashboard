import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CourtModuleType } from '../types/court-module-types'
import { useContract } from '../web3-contracts'
import { useCourtConfig } from '../providers/CourtConfig'
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
import { useActivity } from '../components/Activity/ActivityProvider'

import aragonCourtAbi from '../abi/AragonCourt.json'
import courtSubscriptionsAbi from '../abi/CourtSubscriptions.json'
import courtTreasuryAbi from '../abi/CourtTreasury.json'
import disputeManagerAbi from '../abi/DisputeManager.json'
import jurorRegistryAbi from '../abi/JurorRegistry.json'
import tokenAbi from '../abi/ERC20.json'
import votingAbi from '../abi/CRVoting.json'

const GAS_LIMIT = 1200000
const ANJ_ACTIVATE_GAS_LIMIT = 500000
const ANJ_ACTIONS_GAS_LIMIT = 325000
const ACTIVATE_SELECTOR = getFunctionSignature('activate(uint256)')

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
  const { id, modules } = useCourtConfig() || {}

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
  const { addActivity } = useActivity()
  const jurorRegistryContract = useCourtContract(
    CourtModuleType.JurorsRegistry,
    jurorRegistryAbi
  )
  const anjTokenContract = useANJTokenContract()

  // activate ANJ directly from available balance
  const activateANJ = useCallback(
    amount => {
      return addActivity(
        jurorRegistryContract.activate(amount, {
          gasLimit: ANJ_ACTIVATE_GAS_LIMIT,
        }),
        'activateAnj',
        { amount: formatUnits(amount) }
      )
    },
    [jurorRegistryContract, addActivity]
  )

  const deactivateANJ = useCallback(
    amount => {
      return addActivity(
        jurorRegistryContract.deactivate(amount, {
          gasLimit: ANJ_ACTIONS_GAS_LIMIT,
        }),
        'deactivateAnj',
        { amount: formatUnits(amount) }
      )
    },
    [jurorRegistryContract, addActivity]
  )

  // approve, stake and activate ANJ
  const stakeActivateANJ = useCallback(
    amount => {
      return addActivity(
        anjTokenContract.approveAndCall(
          jurorRegistryContract.address,
          amount,
          ACTIVATE_SELECTOR,
          { gasLimit: ANJ_ACTIVATE_GAS_LIMIT }
        ),
        'stakeActivateAnj',
        { amount: formatUnits(amount) }
      )
    },
    [anjTokenContract, jurorRegistryContract, addActivity]
  )

  const withdrawANJ = useCallback(
    amount => {
      return addActivity(
        jurorRegistryContract.unstake(amount, '0x', {
          gasLimit: ANJ_ACTIONS_GAS_LIMIT,
        }),
        'withdrawAnj',
        { amount: formatUnits(amount) }
      )
    },
    [jurorRegistryContract, addActivity]
  )

  return { activateANJ, deactivateANJ, stakeActivateANJ, withdrawANJ }
}

/**
 * All dispute interactions
 * @returns {Object} all available functions around a dispute
 */
export function useDisputeActions() {
  const { addActivity } = useActivity()
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
    disputeId => {
      return addActivity(
        disputeManagerContract.draft(disputeId, {
          gasLimit: GAS_LIMIT,
        }),
        'draftJury',
        { disputeId }
      )
    },
    [disputeManagerContract, addActivity]
  )

  // Commit
  const commit = useCallback(
    (disputeId, roundId, commitment, password) => {
      const voteId = getVoteId(disputeId, roundId)
      const hashedCommitment = hashVote(commitment, password)
      return addActivity(
        votingContract.commit(voteId, hashedCommitment),
        'commitVote',
        { disputeId, roundId, commitment }
      )
    },
    [votingContract, addActivity]
  )

  // Reveal
  const reveal = useCallback(
    (disputeId, roundId, voter, commitment, salt) => {
      const voteId = getVoteId(disputeId, roundId)
      const outcome = getOutcomeFromCommitment(commitment, salt)
      return addActivity(
        votingContract.reveal(voteId, voter, outcome, hashPassword(salt)),
        'revealVote',
        { roundId, disputeId }
      )
    },
    [votingContract, addActivity]
  )

  // Leak
  const leak = useCallback(
    (voteId, voter, outcome, salt) => {
      return addActivity(
        votingContract.leak(voteId, voter, outcome, salt),
        'leakVote',
        { voteId, voter }
      )
    },
    [votingContract, addActivity]
  )

  const approveFeeDeposit = useCallback(
    value => {
      return addActivity(
        feeTokenContract.approve(disputeManagerContract.address, value),
        'approveFeeDeposit',
        { amount: formatUnits(value) }
      )
    },
    [disputeManagerContract, feeTokenContract, addActivity]
  )

  // Appeal round of dispute
  const appeal = useCallback(
    (disputeId, roundId, ruling) => {
      return addActivity(
        disputeManagerContract.createAppeal(disputeId, roundId, ruling, {
          gasLimit: GAS_LIMIT,
        }),
        'appealRuling',
        { disputeId, roundId, ruling }
      )
    },
    [disputeManagerContract, addActivity]
  )

  // Confirm appeal round of dispute
  const confirmAppeal = useCallback(
    (disputeId, round, ruling) => {
      return addActivity(
        disputeManagerContract.confirmAppeal(disputeId, round, ruling, {
          gasLimit: GAS_LIMIT,
        }),
        'confirmAppeal',
        { disputeId, roundId: round, ruling }
      )
    },
    [disputeManagerContract, addActivity]
  )

  const executeRuling = useCallback(
    disputeId => {
      return addActivity(
        aragonCourtContract.executeRuling(disputeId, {
          gasLimit: GAS_LIMIT,
        }),
        'executeRuling',
        { disputeId }
      )
    },
    [aragonCourtContract, addActivity]
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

export function useHeartbeat() {
  const { addActivity } = useActivity()
  const aragonCourtContract = useCourtContract(
    CourtModuleType.AragonCourt,
    aragonCourtAbi
  )

  return useCallback(
    transitions => {
      return addActivity(
        aragonCourtContract.heartbeat(transitions),
        'heartbeat',
        { transitions }
      )
    },
    [addActivity, aragonCourtContract]
  )
}

export function useRewardActions() {
  const { addActivity } = useActivity()
  const disputeManagerContract = useCourtContract(
    CourtModuleType.DisputeManager,
    disputeManagerAbi
  )

  const treasuryContract = useCourtContract(
    CourtModuleType.Treasury,
    courtTreasuryAbi
  )

  const settleReward = useCallback(
    (disputeId, roundId, juror) => {
      return addActivity(
        disputeManagerContract.settleReward(disputeId, roundId, juror, {
          gasLimit: GAS_LIMIT,
        }),
        'settleReward',
        { disputeId, roundId }
      )
    },
    [addActivity, disputeManagerContract]
  )

  const settleAppealDeposit = useCallback(
    (disputeId, roundId) => {
      return addActivity(
        disputeManagerContract.settleAppealDeposit(disputeId, roundId, {
          gasLimit: GAS_LIMIT,
        }),
        'settleAppealDeposit',
        { roundId, disputeId }
      )
    },
    [addActivity, disputeManagerContract]
  )

  const withdraw = useCallback(
    (token, to, amount) => {
      return treasuryContract.withdraw(token, to, amount, {
        gasLimit: ANJ_ACTIONS_GAS_LIMIT,
      })
    },
    [treasuryContract]
  )

  return { settleReward, settleAppealDeposit, withdraw }
}

export function useCourtSubscriptionActions() {
  const courtSubscriptionsContract = useCourtContract(
    CourtModuleType.Subscriptions,
    courtSubscriptionsAbi
  )

  const claimFees = useCallback(
    periodId => {
      return courtSubscriptionsContract.claimFees(periodId)
    },
    [courtSubscriptionsContract]
  )

  const getCurrentPeriodId = useCallback(() => {
    return courtSubscriptionsContract.getCurrentPeriodId()
  }, [courtSubscriptionsContract])

  const getJurorShare = useCallback(
    (juror, periodId) => {
      return courtSubscriptionsContract.getJurorShare(juror, periodId)
    },
    [courtSubscriptionsContract]
  )

  const hasJurorClaimed = useCallback(
    (juror, periodId) => {
      return courtSubscriptionsContract.hasJurorClaimed(juror, periodId)
    },
    [courtSubscriptionsContract]
  )

  const getters = useMemo(
    () =>
      courtSubscriptionsContract
        ? { getCurrentPeriodId, getJurorShare, hasJurorClaimed }
        : null,
    [
      courtSubscriptionsContract,
      getCurrentPeriodId,
      getJurorShare,
      hasJurorClaimed,
    ]
  )

  return {
    claimFees,
    getters,
  }
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

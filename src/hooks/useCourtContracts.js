import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { captureException } from '@sentry/browser'
import { CourtModuleType } from '../types/court-module-types'
import { useActivity } from '../components/Activity/ActivityProvider'
import { useContract, useContractReadOnly } from '../web3-contracts'
import { useCourtConfig } from '../providers/CourtConfig'
import { useTransactionQueue } from '../providers/TransactionQueue'
import requestAutoReveal from '../services/requestAutoReveal'
import { getFunctionSignature } from '../lib/web3-utils'
import { bigNum, formatUnits } from '../lib/math-utils'
import {
  hashVote,
  getOutcomeFromCommitment,
  getVoteId,
  hashPassword,
} from '../utils/crvoting-utils'
import { retryMax } from '../utils/retry-max'
import radspec from '../radspec'
import { getKnownToken } from '../utils/known-tokens'
import { getModuleAddress } from '../utils/court-utils'
import { saveCodeInLocalStorage } from '../utils/one-time-code-utils'
import { networkAgentAddress, networkReserveAddress } from '../networks'

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
  const { addTransaction } = useTransactionQueue()
  const jurorRegistryContract = useCourtContract(
    CourtModuleType.JurorsRegistry,
    jurorRegistryAbi
  )
  const anjTokenContract = useANJTokenContract()

  // activate ANJ directly from available balance
  const activateANJ = useCallback(
    amount => {
      const formattedAmount = formatUnits(amount)

      return addTransaction({
        intent: () =>
          addActivity(
            jurorRegistryContract.activate(amount, {
              gasLimit: ANJ_ACTIVATE_GAS_LIMIT,
            }),
            'activateAnj',
            { amount: formattedAmount }
          ),
        description: radspec.activateAnj(formattedAmount),
      })
    },
    [addActivity, addTransaction, jurorRegistryContract]
  )

  const deactivateANJ = useCallback(
    amount => {
      const formattedAmount = formatUnits(amount)

      return addTransaction({
        intent: () =>
          addActivity(
            jurorRegistryContract.deactivate(amount, {
              gasLimit: ANJ_ACTIONS_GAS_LIMIT,
            }),
            'deactivateAnj',
            { amount: formattedAmount }
          ),
        description: radspec.deactivateAnj(formattedAmount),
      })
    },
    [addActivity, addTransaction, jurorRegistryContract]
  )

  // approve, stake and activate ANJ
  const stakeActivateANJ = useCallback(
    amount => {
      const formattedAmount = formatUnits(amount)

      return addTransaction({
        intent: () =>
          addActivity(
            anjTokenContract.approveAndCall(
              jurorRegistryContract.address,
              amount,
              ACTIVATE_SELECTOR,
              { gasLimit: ANJ_ACTIVATE_GAS_LIMIT }
            ),
            'activateAnj',
            { amount: formattedAmount }
          ),
        description: radspec.activateAnj(formattedAmount),
      })
    },
    [addActivity, addTransaction, anjTokenContract, jurorRegistryContract]
  )

  const withdrawANJ = useCallback(
    amount => {
      const formattedAmount = formatUnits(amount)

      return addTransaction({
        intent: () =>
          addActivity(
            jurorRegistryContract.unstake(amount, '0x', {
              gasLimit: ANJ_ACTIONS_GAS_LIMIT,
            }),
            'withdrawAnj',
            { amount: formattedAmount }
          ),
        description: radspec.withdrawAnj(formattedAmount),
      })
    },
    [addActivity, addTransaction, jurorRegistryContract]
  )

  return { activateANJ, deactivateANJ, stakeActivateANJ, withdrawANJ }
}

/**
 * All dispute interactions
 * @returns {Object} all available functions around a dispute
 */
export function useDisputeActions() {
  const { addActivity } = useActivity()
  const { addTransaction, addTransactions } = useTransactionQueue()
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
      return addTransaction({
        intent: () =>
          addActivity(
            disputeManagerContract.draft(disputeId, {
              gasLimit: GAS_LIMIT,
            }),
            'draftJury',
            { disputeId }
          ),
        description: radspec.draftJury(disputeId),
      })
    },
    [addActivity, addTransaction, disputeManagerContract]
  )

  // Commit
  const commit = useCallback(
    (account, disputeId, roundId, outcome, password, revealServiceEnabled) => {
      const voteId = getVoteId(disputeId, roundId)
      const commitment = hashVote(outcome, password)

      const transactionQueue = [
        {
          intent: () =>
            addActivity(
              votingContract.commit(voteId, commitment),
              'commitVote',
              {
                disputeId,
                roundId,
                outcome,
              }
            ),
          description: radspec.commitVote(disputeId, roundId, outcome),
          waitForConfirmation: true,
          // Callback function to run after main tx
          callback: () => saveCodeInLocalStorage(account, disputeId, password),
        },
      ]

      // If juror opted-in for the reveal service we'll send the commitment and password to the court-server
      if (revealServiceEnabled) {
        transactionQueue.push({
          intent: async () => {
            return requestAutoReveal(
              account,
              disputeId,
              roundId,
              outcome,
              password
            )
          },
          description: 'Request auto-reveal service',
          onError: 'Failed to request auto-reveal service',
          onSuccess: 'Auto-reveal service requested!',
          skipSignature: true,
        })
      }

      return addTransactions(transactionQueue)
    },
    [addActivity, addTransactions, votingContract]
  )

  // Reveal
  const reveal = useCallback(
    (disputeId, roundId, voter, commitment, password) => {
      const voteId = getVoteId(disputeId, roundId)
      const outcome = getOutcomeFromCommitment(commitment, password)

      return addTransaction({
        intent: () =>
          addActivity(
            votingContract.reveal(
              voteId,
              voter,
              outcome,
              hashPassword(password)
            ),
            'revealVote',
            { disputeId, roundId }
          ),
        description: radspec.revealVote(disputeId, roundId),
      })
    },
    [addActivity, addTransaction, votingContract]
  )

  // Leak
  const leak = useCallback(
    (voteId, voter, outcome, salt) => {
      return addTransaction({
        intent: () =>
          addActivity(
            votingContract.leak(voteId, voter, outcome, salt),
            'leakVote',
            { voteId, voter }
          ),
        descritpion: radspec.leakVote(voteId, voter),
      })
    },
    [addActivity, addTransaction, votingContract]
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
    [addActivity, disputeManagerContract]
  )

  // Confirm appeal round of dispute
  const confirmAppeal = useCallback(
    (disputeId, roundId, ruling) => {
      return addActivity(
        disputeManagerContract.confirmAppeal(disputeId, roundId, ruling, {
          gasLimit: GAS_LIMIT,
        }),
        'confirmAppeal',
        { disputeId, roundId, ruling }
      )
    },
    [disputeManagerContract, addActivity]
  )

  // General function that will appeal or confirm appeal a given round on a given dispute
  const appealRound = useCallback(
    (disputeId, roundId, ruling, requiredDeposit, allowance, confirm) => {
      const transactionQueue = []

      // Check if requires pre-transactions
      if (allowance.lt(requiredDeposit)) {
        // TODO: some ERC20s don't let to set a new allowance if the current allowance is positive (handle this cases)
        if (!allowance.eq(0)) {
          console.warn('Allowance must be zero')
        }

        // Approve fee deposit for appealing
        transactionQueue.push({
          intent: () => approveFeeDeposit(requiredDeposit),
          description: radspec.approveFeeDeposit(formatUnits(requiredDeposit)),
          waitForConfirmation: true,
        })
      }

      const action = confirm ? confirmAppeal : appeal

      transactionQueue.push({
        intent: () => action(disputeId, roundId, ruling),
        description: radspec[confirm ? 'confirmAppeal' : 'appealRuling'](
          disputeId,
          roundId,
          ruling
        ),
      })

      return addTransactions(transactionQueue)
    },
    [addTransactions, appeal, approveFeeDeposit, confirmAppeal]
  )

  const executeRuling = useCallback(
    disputeId => {
      return addTransaction({
        intent: () =>
          addActivity(
            aragonCourtContract.executeRuling(disputeId, {
              gasLimit: GAS_LIMIT,
            }),
            'executeRuling',
            { disputeId }
          ),
        description: radspec.executeRuling(disputeId),
      })
    },
    [addActivity, addTransaction, aragonCourtContract]
  )

  return {
    appealRound,
    commit,
    draft,
    executeRuling,
    leak,
    reveal,
  }
}

export function useHeartbeat() {
  const { addActivity } = useActivity()
  const { addTransaction } = useTransactionQueue()
  const aragonCourtContract = useCourtContract(
    CourtModuleType.AragonCourt,
    aragonCourtAbi
  )

  return useCallback(
    transitions => {
      return addTransaction({
        intent: () =>
          addActivity(aragonCourtContract.heartbeat(transitions), 'heartbeat', {
            transitions,
          }),
        description: radspec.heartbeat(transitions),
      })
    },
    [addActivity, addTransaction, aragonCourtContract]
  )
}

export function useRewardActions() {
  const { addActivity } = useActivity()
  const { addTransactions } = useTransactionQueue()
  const { claimFees } = useCourtSubscriptionActions()
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
      return addActivity(
        treasuryContract.withdraw(token, to, amount, {
          gasLimit: ANJ_ACTIONS_GAS_LIMIT,
        }),
        'claimRewards',
        { amount: formatUnits(amount) }
      )
    },
    [addActivity, treasuryContract]
  )

  const claimRewards = useCallback(
    (
      account,
      arbitrableFees,
      appealFees,
      treasuryFees,
      subscriptionFees,
      feeTokenAddress
    ) => {
      const transactionQueue = []

      // Claim all arbitrable fee rewards
      for (const arbitrableFee of arbitrableFees) {
        const { disputeId, rounds } = arbitrableFee
        for (const roundId of rounds) {
          transactionQueue.push({
            intent: () => settleReward(disputeId, roundId, account),
            description: radspec.settleReward(roundId, disputeId),
          })
        }
      }

      // Claim all appeal fee rewards
      for (const appealFee of appealFees) {
        const { disputeId, rounds } = appealFee
        for (const roundId of rounds) {
          transactionQueue.push({
            intent: () => settleAppealDeposit(disputeId, roundId),
            description: radspec.settleAppealDeposit(roundId, disputeId),
          })
        }
      }

      // If we have settlements to do, then we'll make sure that the last
      // settlement is confirmed before withdrawing total fees from the treasury
      if (transactionQueue.length > 0) {
        const lastSettlement = transactionQueue.pop()
        transactionQueue.push({
          ...lastSettlement,
          waitForConfirmation: true,
        })
      }

      // Withdraw funds from treasury
      if (treasuryFees.gt(0)) {
        transactionQueue.push({
          intent: () => withdraw(feeTokenAddress, account, treasuryFees),
          description: radspec.claimRewards(formatUnits(treasuryFees)),
        })
      }

      // Claim subscription fees
      for (const subscriptionFee of subscriptionFees) {
        transactionQueue.push({
          intent: () => claimFees(subscriptionFee.periodId),
          description: radspec.claimSubscriptionFees(subscriptionFee.periodId),
        })
      }

      return addTransactions(transactionQueue)
    },
    [addTransactions, claimFees, settleAppealDeposit, settleReward, withdraw]
  )

  return { claimRewards }
}

export function useCourtSubscriptionActions() {
  const { addActivity } = useActivity()
  const courtSubscriptionsContract = useCourtContract(
    CourtModuleType.Subscriptions,
    courtSubscriptionsAbi
  )

  const claimFees = useCallback(
    periodId => {
      return addActivity(
        courtSubscriptionsContract.claimFees(periodId),
        'claimSubscriptionFees',
        { periodId }
      )
    },
    [addActivity, courtSubscriptionsContract]
  )

  const getJurorShare = useCallback(
    (juror, periodId) => {
      return courtSubscriptionsContract.getJurorShare(juror, periodId)
    },
    [courtSubscriptionsContract]
  )

  const getters = useMemo(
    () => (courtSubscriptionsContract ? { getJurorShare } : null),
    [courtSubscriptionsContract, getJurorShare]
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
  const [appealDeposits, setAppealDeposits] = useState({
    amounts: [bigNum(0), bigNum(0)],
    error: false,
  })

  const disputeManagerContract = useCourtContract(
    CourtModuleType.DisputeManager,
    disputeManagerAbi
  )

  useEffect(() => {
    let cancelled = false

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

            if (!cancelled) {
              setAppealDeposits({
                amounts: [appealDeposit, confirmAppealDeposit],
                error: false,
              })
            }
          })
          .catch(err => {
            captureException(err)
            if (!cancelled) {
              setAppealDeposits(appealDeposits => ({
                ...appealDeposits,
                error: true,
              }))
            }
          })
      )
    }

    fetchNextRoundDetails()

    return () => {
      cancelled = true
    }
  }, [disputeId, disputeManagerContract, roundId])

  return [appealDeposits.amounts, appealDeposits.error]
}

export function useFeeBalanceOf(account) {
  const [feeBalance, setFeeBalance] = useState({
    amount: bigNum(0),
    error: false,
  })

  const feeTokenContract = useFeeTokenContract()

  useEffect(() => {
    let cancelled = false

    const getFeeBalance = async () => {
      if (!feeTokenContract) return

      retryMax(() => feeTokenContract.balanceOf(account))
        .then(balance => {
          if (!cancelled) {
            setFeeBalance({ amount: balance, error: false })
          }
        })
        .catch(err => {
          captureException(err)
          if (!cancelled) {
            setFeeBalance(feeBalance => ({
              ...feeBalance,
              error: true,
            }))
          }
        })
    }

    getFeeBalance()

    return () => {
      cancelled = true
    }
  }, [account, feeTokenContract])

  return [feeBalance.amount, feeBalance.error]
}

export function useAppealFeeAllowance(owner) {
  const [allowance, setAllowance] = useState({
    amount: bigNum(0),
    error: false,
  })

  const courtConfig = useCourtConfig()
  const disputeManagerAddress = getModuleAddress(
    courtConfig.modules,
    CourtModuleType.DisputeManager
  )
  const feeTokenContract = useFeeTokenContract()

  useEffect(() => {
    let cancelled = false

    const getFeeAllowance = async () => {
      if (!feeTokenContract) return

      retryMax(() => feeTokenContract.allowance(owner, disputeManagerAddress))
        .then(allowance => {
          if (!cancelled) {
            setAllowance({ amount: allowance, error: false })
          }
        })
        .catch(err => {
          captureException(err)
          if (!cancelled) {
            setAllowance(allowance => ({
              ...allowance,
              error: true,
            }))
          }
        })
    }

    getFeeAllowance()

    return () => {
      cancelled = true
    }
  }, [disputeManagerAddress, feeTokenContract, owner])

  return [allowance.amount, allowance.error]
}

export function useActiveBalanceOfAt(juror, termId) {
  const jurorRegistryContract = useCourtContract(
    CourtModuleType.JurorsRegistry,
    jurorRegistryAbi
  )
  const [activeBalance, setActiveBalance] = useState({
    amount: bigNum(-1),
    error: false,
  })

  useEffect(() => {
    let cancelled = false

    const getActiveBalanceOfAt = async () => {
      if (!jurorRegistryContract) return

      retryMax(() => jurorRegistryContract.activeBalanceOfAt(juror, termId))
        .then(balance => {
          if (!cancelled) {
            setActiveBalance({ amount: balance, error: false })
          }
        })
        .catch(err => {
          captureException(err)
          if (!cancelled) {
            setActiveBalance(balance => ({
              ...balance,
              error: true,
            }))
          }
        })
    }

    getActiveBalanceOfAt()

    return () => {
      cancelled = true
    }
  }, [juror, jurorRegistryContract, termId])

  return [activeBalance.amount, activeBalance.error]
}

export function useTotalANTStakedPolling(timeout = 1000) {
  const [totalANTStaked, setTotalANTStaked] = useState(bigNum(-1))
  const [error, setError] = useState(false)
  const { address: antAddress } = getKnownToken('ANT') || {}
  const antContract = useContractReadOnly(antAddress, tokenAbi)

  // We are starting in 0 in order to immediately make the fetch call
  const controlledTimeout = useRef(0)

  useEffect(() => {
    let cancelled = false
    let timeoutId

    // This stat is only relevant and shown on mainnet
    if (!networkAgentAddress || !networkReserveAddress) {
      return setError(true)
    }

    if (!antContract) {
      return
    }

    const fetchTotalANTBalance = () => {
      timeoutId = setTimeout(() => {
        const agentBalancePromise = antContract.balanceOf(networkAgentAddress)
        const vaultBalancePromise = antContract.balanceOf(networkReserveAddress)
        return Promise.all([agentBalancePromise, vaultBalancePromise])
          .then(([antInAgent, antInVault]) => {
            if (!cancelled) {
              setTotalANTStaked(antInAgent.add(antInVault))
            }
          })
          .catch(err => {
            console.error(`Error fetching balance: ${err} retrying...`)
            setError(true)
          })
          .finally(() => {
            if (!cancelled) {
              clearTimeout(timeoutId)
              controlledTimeout.current = timeout
              fetchTotalANTBalance()
            }
          })
      }, controlledTimeout.current)
    }

    fetchTotalANTBalance()

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [antContract, controlledTimeout, timeout])

  return [totalANTStaked, error]
}

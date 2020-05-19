import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { captureException } from '@sentry/browser'

// hoooks
import { useCourtConfig } from '../providers/CourtConfig'
import { useRequestQueue } from '../providers/RequestQueue'
import { useRequestProcessor } from './useRequestProcessor'
import { useContract, useContractReadOnly } from '../web3-contracts'
import { useActivity } from '../components/Activity/ActivityProvider'

// services
import requestAutoReveal from '../services/requestAutoReveal'

// utils
import radspec from '../radspec'
import { retryMax } from '../utils/retry-max'
import actions from '../types/court-action-types'
import { getKnownToken } from '../utils/known-tokens'
import { getModuleAddress } from '../utils/court-utils'
import { bigNum, formatUnits } from '../lib/math-utils'
import { getFunctionSignature } from '../lib/web3-utils'
import { CourtModuleType } from '../types/court-module-types'
import { saveCodeInLocalStorage } from '../utils/one-time-code-utils'
import { networkAgentAddress, networkReserveAddress } from '../networks'
import { hashVote, getVoteId, hashPassword } from '../utils/crvoting-utils'

// abis
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
  const processRequests = useRequestProcessor()
  const jurorRegistryContract = useCourtContract(
    CourtModuleType.JurorsRegistry,
    jurorRegistryAbi
  )
  const anjTokenContract = useANJTokenContract()

  // activate ANJ directly from available balance
  const activateANJ = useCallback(
    amount => {
      const formattedAmount = formatUnits(amount)

      return processRequests({
        action: () =>
          jurorRegistryContract.activate(amount, {
            gasLimit: ANJ_ACTIVATE_GAS_LIMIT,
          }),
        name: actions.ActivateAnj,
        params: { amount: formattedAmount },
      })
    },
    [jurorRegistryContract, processRequests]
  )

  const deactivateANJ = useCallback(
    amount => {
      const formattedAmount = formatUnits(amount)

      return processRequests({
        action: () =>
          jurorRegistryContract.deactivate(amount, {
            gasLimit: ANJ_ACTIONS_GAS_LIMIT,
          }),
        name: actions.DeactivateAnj,
        params: { amount: formattedAmount },
      })
    },
    [jurorRegistryContract, processRequests]
  )

  // approve, stake and activate ANJ
  const stakeActivateANJ = useCallback(
    amount => {
      const formattedAmount = formatUnits(amount)

      return processRequests({
        action: () =>
          anjTokenContract.approveAndCall(
            jurorRegistryContract.address,
            amount,
            ACTIVATE_SELECTOR,
            { gasLimit: ANJ_ACTIVATE_GAS_LIMIT }
          ),
        name: actions.ActivateAnj,
        params: { amount: formattedAmount },
      })
    },
    [anjTokenContract, jurorRegistryContract, processRequests]
  )

  const withdrawANJ = useCallback(
    amount => {
      const formattedAmount = formatUnits(amount)

      return processRequests({
        action: () =>
          jurorRegistryContract.unstake(amount, '0x', {
            gasLimit: ANJ_ACTIONS_GAS_LIMIT,
          }),
        name: actions.WithdrawAnj,
        params: { amount: formattedAmount },
      })
    },
    [jurorRegistryContract, processRequests]
  )

  return { activateANJ, deactivateANJ, stakeActivateANJ, withdrawANJ }
}

/**
 * All dispute interactions
 * @returns {Object} all available functions around a dispute
 */
export function useDisputeActions() {
  const processRequests = useRequestProcessor()
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
      return processRequests({
        action: () =>
          disputeManagerContract.draft(disputeId, {
            gasLimit: GAS_LIMIT,
          }),
        name: actions.DraftJury,
        params: { disputeId },
      })
    },
    [disputeManagerContract, processRequests]
  )

  // Commit
  const commit = useCallback(
    (account, disputeId, roundId, outcome, password, revealServiceEnabled) => {
      const voteId = getVoteId(disputeId, roundId)
      const commitment = hashVote(outcome, password)

      const requestQueue = [
        {
          action: () => votingContract.commit(voteId, commitment),
          name: actions.CommitVote,
          params: {
            disputeId,
            roundId,
            outcome,
          },
          ensureConfirmation: true,
          // Callback function to run after main tx
          callback: () => saveCodeInLocalStorage(account, disputeId, password),
        },
      ]

      // If juror opted-in for the reveal service we'll send the commitment and password to the court-server
      if (revealServiceEnabled) {
        requestQueue.push({
          action: async () => {
            return requestAutoReveal(
              account,
              disputeId,
              roundId,
              outcome,
              password
            )
          },
          isTx: false,
          description: 'Enable auto-reveal service',
          onError: 'Failed to enable auto-reveal service',
          onSuccess: 'Auto-reveal service enabled!',
        })
      }

      return processRequests(requestQueue)
    },
    [processRequests, votingContract]
  )

  // Reveal
  const reveal = useCallback(
    (disputeId, roundId, voter, outcome, password) => {
      const voteId = getVoteId(disputeId, roundId)

      return processRequests({
        action: () =>
          votingContract.reveal(voteId, voter, outcome, hashPassword(password)),
        name: actions.RevealVote,
        params: { disputeId, roundId },
      })
    },
    [processRequests, votingContract]
  )

  // Leak
  const leak = useCallback(
    (voteId, voter, outcome, salt) => {
      return processRequests({
        action: () => votingContract.leak(voteId, voter, outcome, salt),
        name: actions.LeakVote,
        params: { voteId, voter },
      })
    },
    [processRequests, votingContract]
  )

  const approveFeeDeposit = useCallback(
    value => {
      return {
        action: () =>
          feeTokenContract.approve(disputeManagerContract.address, value),
        name: actions.ApproveFeeDeposit,
        params: { amount: formatUnits(value) },
      }
    },
    [disputeManagerContract, feeTokenContract]
  )

  // Appeal round of dispute
  const appeal = useCallback(
    (disputeId, roundId, ruling) => {
      return {
        action: () =>
          disputeManagerContract.createAppeal(disputeId, roundId, ruling, {
            gasLimit: GAS_LIMIT,
          }),
        name: actions.AppealRuling,
        params: { disputeId, roundId, ruling },
      }
    },
    [disputeManagerContract]
  )

  // Confirm appeal round of dispute
  const confirmAppeal = useCallback(
    (disputeId, roundId, ruling) => {
      return {
        action: () =>
          disputeManagerContract.confirmAppeal(disputeId, roundId, ruling, {
            gasLimit: GAS_LIMIT,
          }),
        name: actions.ConfirmAppeal,
        params: { disputeId, roundId, ruling },
      }
    },
    [disputeManagerContract]
  )

  // General function that will appeal or confirm appeal a given round on a given dispute
  const appealRound = useCallback(
    (disputeId, roundId, ruling, requiredDeposit, allowance, confirm) => {
      const requestQueue = []

      // Check if requires pre-transactions
      if (allowance.lt(requiredDeposit)) {
        // Some ERC20s don't allow setting a new allowance if the current allowance is positive
        if (!allowance.eq(0)) {
          // Reset allowance
          requestQueue.push({
            ...approveFeeDeposit(0),
            ensureConfirmation: true,
          })
        }

        // Approve fee deposit for appealing
        requestQueue.push({
          ...approveFeeDeposit(requiredDeposit),
          ensureConfirmation: true,
        })
      }

      const action = confirm ? confirmAppeal : appeal

      requestQueue.push(action(disputeId, roundId, ruling))

      return processRequests(requestQueue)
    },
    [appeal, approveFeeDeposit, confirmAppeal, processRequests]
  )

  const executeRuling = useCallback(
    disputeId => {
      return processRequests({
        action: () =>
          aragonCourtContract.executeRuling(disputeId, {
            gasLimit: GAS_LIMIT,
          }),
        name: actions.ExecuteRuling,
        params: { disputeId },
      })
    },
    [aragonCourtContract, processRequests]
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
  const { addRequests } = useRequestQueue()
  const aragonCourtContract = useCourtContract(
    CourtModuleType.AragonCourt,
    aragonCourtAbi
  )

  const request = useCallback(
    (transitions, ensureConfirmation = false) => ({
      intent: () =>
        addActivity(aragonCourtContract.heartbeat(transitions), 'heartbeat', {
          transitions,
        }),
      description: radspec.heartbeat(transitions),
      isTx: true,
      ensureConfirmation,
    }),
    [addActivity, aragonCourtContract]
  )

  const heartbeat = useCallback(
    transitions => {
      return addRequests(request(transitions))
    },
    [addRequests, request]
  )

  return { heartbeat, request }
}

export function useRewardActions() {
  const processRequests = useRequestProcessor()
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
      return {
        action: () =>
          disputeManagerContract.settleReward(disputeId, roundId, juror, {
            gasLimit: GAS_LIMIT,
          }),
        name: actions.SettleReward,
        params: { roundId, disputeId },
      }
    },
    [disputeManagerContract]
  )

  const settleAppealDeposit = useCallback(
    (disputeId, roundId) => {
      return {
        action: () =>
          disputeManagerContract.settleAppealDeposit(disputeId, roundId, {
            gasLimit: GAS_LIMIT,
          }),
        name: actions.SettleAppealDeposit,
        params: { roundId, disputeId },
      }
    },
    [disputeManagerContract]
  )

  const withdraw = useCallback(
    (token, to, amount) => {
      return {
        action: () =>
          treasuryContract.withdraw(token, to, amount, {
            gasLimit: ANJ_ACTIONS_GAS_LIMIT,
          }),
        name: actions.ClaimRewards,
        params: { amount: formatUnits(amount) },
      }
    },
    [treasuryContract]
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
      const requestQueue = []

      // Claim all arbitrable fee rewards
      for (const arbitrableFee of arbitrableFees) {
        const { disputeId, rounds } = arbitrableFee
        for (const roundId of rounds) {
          requestQueue.push(settleReward(disputeId, roundId, account))
        }
      }

      // Claim all appeal fee rewards
      for (const appealFee of appealFees) {
        const { disputeId, rounds } = appealFee
        for (const roundId of rounds) {
          requestQueue.push(settleAppealDeposit(disputeId, roundId))
        }
      }

      // If we have settlements to do, then we'll make sure that the last
      // settlement is confirmed before withdrawing total fees from the treasury
      if (requestQueue.length > 0) {
        const lastSettlement = requestQueue.pop()
        requestQueue.push({
          ...lastSettlement,
          ensureConfirmation: true,
        })
      }

      // Withdraw funds from treasury
      if (treasuryFees.gt(0)) {
        requestQueue.push(withdraw(feeTokenAddress, account, treasuryFees))
      }

      // Claim subscription fees
      for (const subscriptionFee of subscriptionFees) {
        requestQueue.push(claimFees(subscriptionFee.periodId))
      }

      return processRequests(requestQueue)
    },
    [claimFees, processRequests, settleAppealDeposit, settleReward, withdraw]
  )

  return { claimRewards }
}

export function useCourtSubscriptionActions() {
  const courtSubscriptionsContract = useCourtContract(
    CourtModuleType.Subscriptions,
    courtSubscriptionsAbi
  )

  const claimFees = useCallback(
    periodId => {
      return {
        action: () => courtSubscriptionsContract.claimFees(periodId),
        name: actions.ClaimSubscriptionFees,
        params: { periodId },
      }
    },
    [courtSubscriptionsContract]
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

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import StoredList from '../../StoredList'
import { getNetworkType } from '../../lib/web3-utils'
import { MINUTE } from '../../utils/date-utils'
import { useWallet } from '../../providers/Wallet'
import {
  ACTIVITY_STATUS_CONFIRMED,
  ACTIVITY_STATUS_FAILED,
  ACTIVITY_STATUS_PENDING,
  ACTIVITY_STATUS_TIMED_OUT,
} from './activity-statuses'

const ActivityContext = React.createContext()

// Only used to serialize / deserialize the symbols
const SymbolsByName = new Map(
  Object.entries({
    ACTIVITY_STATUS_CONFIRMED,
    ACTIVITY_STATUS_FAILED,
    ACTIVITY_STATUS_PENDING,
    ACTIVITY_STATUS_TIMED_OUT,
  })
)

const TIMEOUT_DURATION = 10 * MINUTE

function getStoredList(account) {
  return new StoredList(`activity:${getNetworkType()}:${account}`, {
    preStringify: activity => ({
      ...activity,
      status: activity.status.description.replace('ACTIVITY_STATUS_', ''),
    }),
    postParse: activity => ({
      ...activity,
      status: SymbolsByName.get(`ACTIVITY_STATUS_${activity.status}`),
    }),
  })
}

async function getActivityFinalStatus(
  ethers,
  { createdAt, transactionHash, status }
) {
  if (status !== ACTIVITY_STATUS_PENDING) {
    return status
  }

  const now = Date.now()

  return Promise.race([
    // Get the transaction status once mined
    ethers
      .getTransaction(String(transactionHash))
      .then(tx => {
        // tx is null if no tx was found
        if (!tx) {
          throw new Error('No transaction found')
        }
        return tx.wait().then(receipt => {
          return receipt.blockNumber
            ? ACTIVITY_STATUS_CONFIRMED
            : ACTIVITY_STATUS_FAILED
        })
      })
      .catch(() => {
        return ACTIVITY_STATUS_FAILED
      }),

    // Timeout after 10 minutes
    new Promise(resolve => {
      if (now - createdAt > TIMEOUT_DURATION) {
        return ACTIVITY_STATUS_TIMED_OUT
      }
      setTimeout(() => {
        resolve(ACTIVITY_STATUS_TIMED_OUT)
      }, TIMEOUT_DURATION - (now - createdAt))
    }),
  ])
}

function ActivityProvider({ children }) {
  const [activities, setActivities] = useState([])
  const storedList = useRef(null)
  const wallet = useWallet()
  const { account, ethers } = wallet

  // Update the activities, ensuring the activities
  // are updated in the stored list and in the state.
  const updateActivities = useCallback(
    cb => {
      const newActivities = cb(activities)
      setActivities(newActivities)
      if (storedList.current) {
        storedList.current.update(newActivities)
      }
    },
    [activities]
  )

  // Add a single activity.
  const addActivity = useCallback(
    async (
      tx,

      // see methods and params defined in activity-types.js
      activityType = 'transaction',
      activityParams = {}
    ) => {
      // tx might be a promise resolving into a tx
      tx = await tx

      updateActivities(activities => [
        ...activities,
        {
          activityParams,
          activityType,
          createdAt: Date.now(),
          from: tx.from,
          nonce: tx.nonce,
          read: false,
          status: ACTIVITY_STATUS_PENDING,
          to: tx.to,
          transactionHash: tx.hash,
        },
      ])

      return tx
    },
    [updateActivities]
  )

  // Clear a single activity
  const removeActivity = useCallback(
    transactionHash => {
      updateActivities(activities =>
        activities.filter(
          activity => activity.transactionHash !== transactionHash
        )
      )
    },
    [updateActivities]
  )

  // Clear all non pending activities − we don’t clear
  // pending because we’re awaiting state change.
  const clearActivities = useCallback(() => {
    updateActivities(activities =>
      activities.filter(activity => activity.status === ACTIVITY_STATUS_PENDING)
    )
  }, [updateActivities])

  // Update the status of a single activity,
  // using its transaction hash.
  const updateActivityStatus = useCallback(
    (hash, status) => {
      updateActivities(activities =>
        activities.map(activity => {
          if (activity.transactionHash !== hash) {
            return activity
          }
          return { ...activity, read: false, status }
        })
      )
    },
    [updateActivities]
  )

  // Mark the current user’s activities as read
  const markActivitiesRead = useCallback(() => {
    updateActivities(activities =>
      activities.map(activity => ({ ...activity, read: true }))
    )
  }, [updateActivities])

  // Total number of unread activities
  const unreadCount = useMemo(() => {
    return activities.reduce((count, { read }) => count + Number(!read), 0)
  }, [activities])

  const updateActivitiesFromStorage = useCallback(() => {
    if (!storedList.current) {
      return
    }

    const activitiesFromStorage = storedList.current
      .getItems()
      .filter(({ transactionHash }) => {
        return (
          activities.findIndex(
            activity => activity.transactionHash === transactionHash
          ) === -1
        )
      })

    if (activitiesFromStorage.length > 0) {
      setActivities(activitiesFromStorage)
    }
  }, [activities])

  // Triggered every time the account changes
  useEffect(() => {
    if (!account) {
      return
    }

    let cancelled = false
    storedList.current = getStoredList(account)
    updateActivitiesFromStorage()

    activities.forEach(async activity => {
      const status = await getActivityFinalStatus(ethers, activity)
      if (!cancelled && status !== activity.status) {
        updateActivityStatus(activity.transactionHash, status)
      }
    })

    return () => {
      cancelled = true
    }
  }, [account, ethers, updateActivityStatus, updateActivitiesFromStorage])

  return (
    <ActivityContext.Provider
      value={{
        activities,
        addActivity,
        clearActivities,
        markActivitiesRead,
        removeActivity,
        unreadCount,
        updateActivities,
      }}
    >
      {children}
    </ActivityContext.Provider>
  )
}

ActivityProvider.propTypes = {
  children: PropTypes.node,
}

function useActivity() {
  return useContext(ActivityContext)
}

export { ActivityProvider, useActivity }

import { useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import { useCourtConfig } from '../providers/CourtConfig'
import { useCourtSubscriptionActions } from './useCourtContracts'
import { useDashboardState } from '../components/Dashboard/DashboardStateProvider'

import { hasJurorClaimed } from '../utils/subscription-utils'

export default function useJurorSubscriptionFees() {
  const wallet = useWallet()
  const { subscriptionModule } = useCourtConfig()
  const { getters } = useCourtSubscriptionActions()
  const { claimedSubscriptionFees } = useDashboardState()

  const [subscriptionFees, setSubscriptionFees] = useState([])

  const periods = subscriptionModule?.periods || []

  useEffect(() => {
    let cancelled = false

    const fetchSubscriptionFees = async () => {
      if (periods.length === 0 || !getters || !claimedSubscriptionFees) {
        return
      }

      try {
        const jurorSubscriptionsFees = []
        // Subscription fees can be only claimed for past periods
        for (let index = 0; index < periods.length - 1; index++) {
          if (cancelled) {
            break
          }

          const period = periods[index]
          if (period.collectedFees.gt(0)) {
            const periodId = period.id

            // TODO: See if we can get the juror share directly from the period data
            const jurorShare = await getters.getJurorShare(
              wallet.account,
              periodId
            )

            // jurorShare is conformed by [address: token, BigNum: shareAmount]
            if (
              jurorShare[1].gt(0) &&
              !hasJurorClaimed(claimedSubscriptionFees, periodId)
            ) {
              jurorSubscriptionsFees.push({
                periodId,
                amount: jurorShare[1],
              })
            }
          }
        }

        if (!cancelled) {
          setSubscriptionFees(jurorSubscriptionsFees)
        }
      } catch (err) {
        console.error(`Error fetching juror subscription fees: ${err}`)
      }
    }

    fetchSubscriptionFees()

    return () => {
      cancelled = true
    }
  }, [claimedSubscriptionFees, getters, periods, wallet.account])

  return subscriptionFees
}

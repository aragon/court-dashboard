import { useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import { useCourtSubscriptionActions } from './useCourtContracts'

export default function useJurorSubscriptionFees() {
  const [subscriptionFees, setSubscriptionFees] = useState([])
  const wallet = useWallet()
  const { getters } = useCourtSubscriptionActions()

  // TODO: We should use the subscription entities data from the subgraph once available and
  // bypass `getCurrentPeriodId` and `hasJurorClaimed` calls
  useEffect(() => {
    let cancelled = false

    const fetchSubscriptionFees = async () => {
      if (!getters) {
        return
      }

      try {
        const currentPeriodId = await getters.getCurrentPeriodId()

        const jurorSubscriptionsFees = []
        for (let periodId = 0; periodId < currentPeriodId; periodId++) {
          if (cancelled) {
            break
          }

          const jurorShare = await getters.getJurorShare(
            wallet.account,
            periodId
          )

          // jurorShare is conformed by [address: token, BigNum: shareAmount]
          if (
            jurorShare[1].gt(0) &&
            !(await getters.hasJurorClaimed(wallet.account, periodId))
          ) {
            jurorSubscriptionsFees.push({ periodId, amount: jurorShare[1] })
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
  }, [getters, wallet.account])

  return [subscriptionFees, setSubscriptionFees]
}

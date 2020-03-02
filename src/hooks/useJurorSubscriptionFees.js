import { useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import { useCourtSubscriptionActions } from './useCourtContracts'

export default function useJurorSubscriptionFees() {
  const [subscriptionFees, setSubscriptionFees] = useState([])
  const wallet = useWallet()
  const { getters } = useCourtSubscriptionActions()

  useEffect(() => {
    const fetchSubscriptionFees = async () => {
      if (!getters) {
        return
      }

      try {
        const currentPeriodId = await getters.getCurrentPeriodId()

        const jurorSubscriptionsFees = []
        for (let periodId = 0; periodId < currentPeriodId; periodId++) {
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

        setSubscriptionFees(jurorSubscriptionsFees)
      } catch (err) {
        console.error(`Error fethcing juror subscription fees: ${err}`)
      }
    }

    fetchSubscriptionFees()
  }, [getters, wallet.account])

  return [subscriptionFees, setSubscriptionFees]
}

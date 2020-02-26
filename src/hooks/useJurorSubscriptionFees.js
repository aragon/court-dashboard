import { useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import { useCourtSubscriptionActions } from './useCourtContracts'

export default function useJurorSubscriptionFees() {
  const [subscriptionFees, setSubscriptionFees] = useState([])

  const wallet = useWallet()
  const {
    getCurrentPeriodId,
    getJurorShare,
    hasJurorClaimed,
  } = useCourtSubscriptionActions()

  useEffect(() => {}, [])
}

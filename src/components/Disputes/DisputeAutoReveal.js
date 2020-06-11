import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, GU, Info } from '@aragon/ui'
import { useWallet } from '../../providers/Wallet'

import { getAutoRevealRequest } from '../../services/autoReveal'
import {
  getAutoRevealPreference,
  getCodeFromLocalStorage,
  getOutcomeFromCommitment,
} from '../../utils/crvoting-utils'

function DisputeAutoReveal({ commitment, disputeId, onAutoReveal, roundId }) {
  const { account } = useWallet()

  const autoRevealRequested = useAutoRevealPolling(account, disputeId, roundId)

  if (autoRevealRequested) {
    return <Info>Auto reveal enabled!</Info>
  }

  return (
    <RequestAutoReveal
      commitment={commitment}
      disputeId={disputeId}
      onAutoReveal={onAutoReveal}
      roundId={roundId}
    />
  )
}

function RequestAutoReveal({ commitment, disputeId, onAutoReveal, roundId }) {
  const { account } = useWallet()
  const autoRevealServiceEnabled = getAutoRevealPreference(account)

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()

      const password = getCodeFromLocalStorage(account, disputeId)
      const outcome = getOutcomeFromCommitment(commitment, password)

      onAutoReveal(account, disputeId, roundId, outcome, password)
    },
    [account, commitment, disputeId, onAutoReveal, roundId]
  )

  return (
    <form onSubmit={handleSubmit}>
      <Button
        label="Reveal your vote with auto-reveal service"
        mode="strong"
        type="submit"
        wide
      />
      {autoRevealServiceEnabled && (
        <Info
          mode="warning"
          css={`
            margin-top: ${2 * GU}px;
          `}
        >
          The auto-reveal service request has failed. Please click on the button
          above to resend the request, reveal your vote and enable the service.
        </Info>
      )}
    </form>
  )
}

function useAutoRevealPolling(account, disputeId, roundId) {
  const [autoRevealRequested, setAutoRevealRequested] = useState(false)
  const timer = 3000

  // We start the timeout timer in 0 in order to immediately make the api call
  const controlledTimer = useRef(0)

  useEffect(() => {
    if (autoRevealRequested) {
      return
    }

    // Assumes jurorDraft exists
    let cancelled = false
    let timeoutId

    const fetchAutoReveal = () => {
      timeoutId = setTimeout(async () => {
        try {
          const reveal = await getAutoRevealRequest(account, disputeId, roundId)

          if (!cancelled) {
            setAutoRevealRequested(Boolean(reveal))
          }
        } catch (err) {
          console.error(`Error fetching auto reveal: ${err} retrying…`)
        }

        if (!cancelled) {
          clearTimeout(timeoutId)
          controlledTimer.current = timer
          if (!autoRevealRequested) {
            fetchAutoReveal()
          }
        }
      }, controlledTimer.current)
    }

    fetchAutoReveal()

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [account, autoRevealRequested, disputeId, roundId])

  return autoRevealRequested
}

export default DisputeAutoReveal

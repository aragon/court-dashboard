import React, { useCallback, useEffect, useState } from 'react'
import { Button, GU, Info } from '@aragon/ui'
import { useWallet } from '../../providers/Wallet'

import { getAutoRevealRequest } from '../../services/autoReveal'
import {
  getAutoRevealPreference,
  getCodeFromLocalStorage,
  getOutcomeFromCommitment,
  getVoteId,
} from '../../utils/crvoting-utils'

function DisputeAutoReveal({ commitment, disputeId, onAutoReveal, roundId }) {
  const { account } = useWallet()

  // We need to poll for the auto reveal request as we are using the request queue processor for processing juror's request to re-register
  // to the service and since the request flow is asynchronous, we can't ensure whether it was succesful or not.
  const [autoRevealRequested, loading] = useAutoRevealPolling(
    account,
    disputeId,
    roundId
  )

  if (loading) {
    return null
  }

  // Juror already requested the auto reveal service for this dispute
  if (autoRevealRequested) {
    return <Info>Auto reveal requested!</Info>
  }

  // Juror requested the auto reveal service and failed or juror didn't request the service at all.
  // For the later case it's still useful to give the juror the option to do so.
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
  const voteId = getVoteId(disputeId, roundId)
  const autoRevealPreviouslyRequested = getAutoRevealPreference(account, voteId)

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
      {autoRevealPreviouslyRequested && (
        <Info
          mode="warning"
          css={`
            margin-top: ${2 * GU}px;
          `}
        >
          Your previous request to enable the auto-reveal service for this vote
          failed.
        </Info>
      )}
    </form>
  )
}

function useAutoRevealPolling(account, disputeId, roundId) {
  const [autoRevealRequested, setAutoRevealRequested] = useState(false)
  const [loading, setLoading] = useState(true)
  const timer = 3000

  useEffect(() => {
    if (autoRevealRequested) {
      return
    }

    let cancelled = false

    // Assumes jurorDraft exists
    const pollAutoReveal = async () => {
      try {
        const reveal = await getAutoRevealRequest(account, disputeId, roundId)
        if (!cancelled) {
          setAutoRevealRequested(Boolean(reveal))
        }
      } catch (err) {
        console.error(`Error fetching auto reveal: ${err} retrying…`)
      }

      if (!cancelled) {
        setLoading(false)

        // Stop the polling once we know the juror successfully requested the auto reveal
        if (!autoRevealRequested) {
          setTimeout(pollAutoReveal, timer)
        }
      }
    }

    pollAutoReveal()

    return () => {
      cancelled = true
    }
  }, [account, autoRevealRequested, disputeId, roundId])

  return [autoRevealRequested, loading]
}

export default DisputeAutoReveal

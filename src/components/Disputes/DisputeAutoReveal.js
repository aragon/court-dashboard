import React, { useEffect, useState } from 'react'
import { Button, GU, Info } from '@aragon/ui'
import { getAutoRevealRequest } from '../../services/autoReveal'

function DisputeAutoReveal({ disputeId, jurorDraft, roundId }) {
  const [autoRevealRequested, setAutoRevealRequested] = useState(false)

  useEffect(() => {
    // Assumes jurorDraft exists
    let cancelled = false

    const fetchAutoReveal = async () => {
      try {
        const reveal = getAutoRevealRequest(
          jurorDraft.juror.id,
          disputeId,
          roundId
        )

        if (!cancelled) {
          setAutoRevealRequested(Boolean(reveal))
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchAutoReveal()

    return () => {
      cancelled = true
    }
  }, [disputeId, jurorDraft.juror.id, roundId])

  if (autoRevealRequested) {
    return null
  }

  return (
    <div>
      <Button label="Reveal your vote with auto-reveal service" mode="strong" />
      <Info
        mode="warning"
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        The auto-reveal service request has failed. Please click on the button
        above to resend the request, reveal your vote and enable the service.
      </Info>
    </div>
  )
}

export default DisputeAutoReveal

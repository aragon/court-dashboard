import React from 'react'

import * as DisputesTypes from '../../types/dispute-status-types'
import DisputeVoting from './Forms/DisputeVoting'
import DisputeDraft from './Forms/DisputeDraft'

const DisputeActions = React.memo(
  ({ dispute, onDraft, onCommit, onReveal, onLeak }) => {
    const { phase } = dispute

    if (phase === DisputesTypes.Phase.Evidence) {
      return null
    }
    console.log('phase', phase)

    return (
      <div
        css={`
          display: flex;
          flex-direction: column;
        `}
      >
        {phase === DisputesTypes.Phase.VotingPeriod && (
          <DisputeVoting
            dispute={dispute}
            onCommit={onCommit}
            onReveal={onReveal}
            onLeak={onLeak}
          />
        )}
        {phase === DisputesTypes.Phase.JuryDrafting && (
          <DisputeDraft dispute={dispute} onDraft={onDraft} />
        )}
      </div>
    )
  }
)

export default DisputeActions

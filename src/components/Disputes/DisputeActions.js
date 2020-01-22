import React from 'react'
import { Help, useTheme } from '@aragon/ui'

import { Phase as DisputePhase } from '../../types/dispute-status-types'
import DisputeVoting from './actions/DisputeVoting'
import DisputeDraft from './actions/DisputeDraft'
import { useConnectedAccount } from '../../providers/Web3'
import { getJurorDraft, jurorVoted } from '../../utils/juror-draft-utils'
import {
  isvoteLeaked,
  getOutcomeFromCommitment,
  voteToString,
} from '../../utils/crvoting-utils'

const getVotingInfoAttributes = (jurorDraft, hasJurorVoted, theme) => {
  const voteLeaked = isvoteLeaked(jurorDraft.outcome)
  if (!hasJurorVoted || voteLeaked) {
    const title = voteLeaked
      ? 'Unfortunately, your vote has been leaked'
      : "Your vote wasn't casted on time."

    const paragraph = (
      <span>
        Your{' '}
        <span
          css={`
            color: ${theme.hint};
          `}
        >
          ANJ locked balance
        </span>{' '}
        has been discounted
      </span>
    )

    return {
      title,
      paragraph,
      background: theme.accent.alpha(0.2),
      hintText: voteLeaked ? 'Vote leaked (complete)' : null,
    }
  }

  const jurorOutcome = getOutcomeFromCommitment(jurorDraft.commitment) // TODO: use jurors password
  const outcomeDescription = voteToString(jurorOutcome)

  return {
    title: 'Your vote was casted successfuly.',
    paragraph: (
      <span>
        You <span css="text-transform: uppercase">{outcomeDescription}</span> on{' '}
        <span>(DATE PLACEHOLDER)</span>
      </span>
    ),
    background: theme.accent.alpha(0.05),
  }
}

const DisputeActions = React.memo(
  ({ dispute, onDraft, onRequestCommit, onReveal, onLeak }) => {
    const { phase, rounds, lastRoundId } = dispute
    const lastRound = rounds[lastRoundId]

    const theme = useTheme()
    const connectedAccount = useConnectedAccount()

    if (phase === DisputePhase.Evidence) {
      return null
    }

    if (phase === DisputePhase.JuryDrafting) {
      return <DisputeDraft dispute={dispute} onDraft={onDraft} />
    }

    const jurorDraft = getJurorDraft(lastRound, connectedAccount)
    const isJurorDrafted = !!jurorDraft
    const hasJurorVoted = isJurorDrafted && jurorVoted(jurorDraft)

    if (phase === DisputePhase.VotingPeriod && !hasJurorVoted) {
      return (
        <DisputeVoting
          isJurorDrafted={isJurorDrafted}
          onRequestCommit={onRequestCommit}
        />
      )
    }

    // If voting period has passed and account connected has not been drafted don't return anything
    if (!isJurorDrafted) return null // TODO: Should we display a message depending on the current phase?

    const { background, title, paragraph, hint } = getVotingInfoAttributes(
      jurorDraft,
      hasJurorVoted,
      theme
    )

    return (
      <VoteInfo
        background={background}
        title={title}
        paragraph={paragraph}
        hint={hint}
      />
    )
    // if (phase === DisputePhase.RevealVote) {
    //   const voteLeaked = isvoteLeaked(jurorDraft.outcome)
    //   const canReveal =
    //     !jurorDraft.outcome && !voteLeaked && phase === DisputePhase.RevealVote

    //   if (voteLeaked) {
    //     return (
    //       <div>
    //         <div>Unforntunately your vote has been leaked</div>
    //       </div>
    //     )
    //   }

    //   return (
    //     <div>
    //       <ActionInfo title=""> Your vote was casted successfully
    //       {canReveal && (
    //         <Button wide mode="strong" onClick={handleReveal}>
    //           Reveal your vote
    //         </Button>
    //       )}
    //     </div>
    //   )
    // }

    // if (isJurorDrafted && !hasJurorVoted && phase === DisputePhase.RevealVote) {
    //   return <div>Your vote wasn't casted on time</div>
    // }
    // }
  }
)

const VoteInfo = ({ background, title, paragraph, hint }) => {
  return (
    <div
      css={`
        background: ${background};
      `}
    >
      <span>{title}</span>
      <span>
        {paragraph} {hint && <Help hint={hint} />}
      </span>
    </div>
  )
}

export default DisputeActions

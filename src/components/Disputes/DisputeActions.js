import React from 'react'

import { GU, Help, textStyle, useTheme } from '@aragon/ui'

import { Phase as DisputePhase } from '../../types/dispute-status-types'

import DisputeVoting from './actions/DisputeVoting'
import DisputeDraft from './actions/DisputeDraft'
import DisputeReveal from './actions/DisputeReveal'
import DisputeAppeal from './actions/DisputeAppeal'
import DisputeExecuteRuling from './actions/DisputeExecuteRuling'

import { useConnectedAccount } from '../../providers/Web3'
import {
  getJurorDraft,
  jurorVoted,
  canJurorReveal,
} from '../../utils/juror-draft-utils'
import {
  isvoteLeaked,
  getOutcomeFromCommitment,
  voteToString,
} from '../../utils/crvoting-utils'

import IconGavelOrange from '../../assets/IconGavelOrange.svg'
import IconGavelRed from '../../assets/IconGavelRed.svg'

function DisputeActions({
  dispute,
  onDraft,
  onRequestCommit,
  onReveal,
  onLeak,
  onRequestAppeal,
  onRequestConfirmAppeal,
  onExecuteRuling,
}) {
  const { phase, rounds, lastRoundId } = dispute
  const lastRound = rounds[lastRoundId]

  console.log('phase', phase)
  const connectedAccount = useConnectedAccount()

  if (phase === DisputePhase.Evidence) {
    return null
  }

  if (phase === DisputePhase.JuryDrafting) {
    return <DisputeDraft disputeId={dispute.id} onDraft={onDraft} />
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

  return (
    <React.Fragment>
      <YourVoteInfo jurorDraft={jurorDraft} hasJurorVoted={hasJurorVoted} />
      {(() => {
        if (phase === DisputePhase.VotingPeriod) return null

        if (isJurorDrafted && hasJurorVoted) {
          if (phase === DisputePhase.RevealVote) {
            return canJurorReveal(jurorDraft) ? (
              <DisputeReveal
                disputeId={dispute.id}
                roundId={dispute.lastRoundId}
                commitment={jurorDraft.commitment}
                onReveal={onReveal}
              />
            ) : null
          } else {
            // If we are not in the reveal phase means we are past it.
            // Check if juror has not revealed on time
            if (!jurorDraft.outcome)
              return <p>You have not revealed on time :(</p> // TODO: Add better descritpion
          }
        }
      })()}

      {(phase === DisputePhase.AppealRuling ||
        phase === DisputePhase.ConfirmAppeal) && (
        <DisputeAppeal
          disputeId={dispute.id}
          roundId={dispute.lastRoundId}
          onRequestAppeal={onRequestAppeal}
          onRequestConfirmAppeal={onRequestConfirmAppeal}
          confirm={phase === DisputePhase.ConfirmAppeal}
        />
      )}
      {phase === DisputePhase.ExecuteRuling && (
        <DisputeExecuteRuling
          disputeId={dispute.id}
          onExecuteRuling={onExecuteRuling}
        />
      )}
    </React.Fragment>
  )
}

const YourVoteInfo = ({ jurorDraft, hasJurorVoted }) => {
  const theme = useTheme()

  if (!jurorDraft) return null

  const { title, paragraph, background, icon, hint } = getVotingInfoAttributes(
    jurorDraft,
    hasJurorVoted,
    theme
  )
  return (
    <div
      css={`
        background: ${background};
        padding: ${3 * GU}px;
        display: flex;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          margin: 0 auto;
        `}
      >
        <div
          css={`
            margin-right: ${1 * GU}px;
          `}
        >
          <img
            alt="vote-info-icon"
            src={icon}
            height="42"
            css={`
              display: block;
            `}
          />
        </div>
        <div>
          <div
            css={`
              ${textStyle('body1')}
            `}
          >
            {title}
          </div>
          <span
            css={`
              ${textStyle('body2')}
              color: ${theme.contentSecondary};
            `}
          >
            {paragraph} {hint && <Help hint={hint} />}
          </span>
        </div>
      </div>
    </div>
  )
}

// Helper function that returns main attributes for the YourVoteInfo component
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
            color: ${theme.help};
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
      icon: IconGavelRed,
      hintText: voteLeaked ? 'Vote leaked (complete)' : null,
    }
  }

  const jurorOutcome = getOutcomeFromCommitment(jurorDraft.commitment) // TODO: use jurors password
  const outcomeDescription = voteToString(jurorOutcome)

  return {
    title: 'Your vote was casted successfuly.',
    paragraph: (
      <span>
        You voted{' '}
        <span
          css={`
            text-transform: uppercase;
            color: ${theme.content};
          `}
        >
          {outcomeDescription}
        </span>{' '}
        on{' '}
        <span
          css={`
            color: ${theme.content};
          `}
        >
          (DATE PLACEHOLDER)
        </span>
      </span>
    ),
    background: theme.accent.alpha(0.05),
    icon: IconGavelOrange,
  }
}

export default DisputeActions

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
import { isvoteLeaked, voteToString } from '../../utils/crvoting-utils'

import IconGavelOrange from '../../assets/IconGavelOrange.svg'
import IconGavelRed from '../../assets/IconGavelRed.svg'
import { getDisputeLastRound } from '../../utils/dispute-utils'
import IconRewardsGreen from '../../assets/IconRewardsGreen.svg'

function DisputeActions({
  dispute,
  onDraft,
  onRequestCommit,
  onRequestReveal,
  onRequestAppeal,
  onExecuteRuling,
}) {
  const { phase } = dispute
  const lastRound = getDisputeLastRound(dispute)

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
      <InformationSection
        phase={phase}
        jurorDraft={jurorDraft}
        hasJurorVoted={hasJurorVoted}
        lastRound={lastRound}
      />
      {(() => {
        if (phase === DisputePhase.VotingPeriod) return null

        if (isJurorDrafted && hasJurorVoted) {
          if (phase === DisputePhase.RevealVote) {
            return (
              canJurorReveal(jurorDraft) && (
                <DisputeReveal
                  disputeId={dispute.id}
                  roundId={dispute.lastRoundId}
                  commitment={jurorDraft.commitment}
                  onRequestReveal={onRequestReveal}
                />
              )
            )
          } else {
            return null
          }
        }
      })()}

      {(phase === DisputePhase.AppealRuling ||
        phase === DisputePhase.ConfirmAppeal) && (
        <DisputeAppeal
          disputeId={dispute.id}
          roundId={dispute.lastRoundId}
          onRequestAppeal={onRequestAppeal}
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

const InformationSection = ({
  phase,
  jurorDraft,
  hasJurorVoted,
  lastRound,
}) => {
  const theme = useTheme()

  if (!jurorDraft) return null

  const { title, paragraph, background, icon, hint } = getInfoAttributes(
    phase,
    jurorDraft,
    hasJurorVoted,
    lastRound,
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
const getInfoAttributes = (
  phase,
  jurorDraft,
  hasJurorVoted,
  lastRound,
  theme
) => {
  const positiveBackground = theme.positive.alpha(0.1)
  const negativeBackground = theme.accent.alpha(0.2)

  let title, paragraph, icon, hintText, background

  const isOpen =
    phase !== DisputePhase.Ruled && phase !== DisputePhase.ClaimRewards
  const votingPeriodEnded =
    phase !== DisputePhase.VotingPeriod && phase !== DisputePhase.RevealVote

  const voteLeaked = isvoteLeaked(jurorDraft.outcome)

  // If vote leaked or juror hasn't voted
  if (!hasJurorVoted || voteLeaked) {
    title = voteLeaked
      ? 'Unfortunately, your vote has been leaked'
      : "Your vote wasn't casted on time."

    paragraph = <ANJDiscountedMessage />
    background = negativeBackground
    icon = IconGavelRed
    hintText = voteLeaked ? 'Vote leaked (complete)' : null
  } else if (hasJurorVoted && votingPeriodEnded) {
    if (!jurorDraft.outcome) {
      title = "Your vote wasn't revealed on time"
      paragraph = <ANJDiscountedMessage />
      background = negativeBackground
      icon = IconGavelRed
    } else {
      const hasVotedInConsensus =
        jurorDraft.outcome === lastRound.vote.winningOutcome

      title = hasVotedInConsensus
        ? 'You have voted in consensus with the mayority'
        : 'You have not voted in consensus with the mayority'
      paragraph = hasVotedInConsensus ? (
        <ANJRewardsMessage isOpen={isOpen} />
      ) : (
        <ANJDiscountedMessage />
      )
      background = hasVotedInConsensus ? positiveBackground : negativeBackground
      icon = IconRewardsGreen // TODO: ask for an Icon rewards red
    }
  } else {
    const outcomeDescription = voteToString(jurorDraft.outcome)

    title = 'Your vote was casted successfuly.'
    paragraph = <VoteInfo outcome={outcomeDescription} />
    background = theme.accent.alpha(0.05)
    icon = IconGavelOrange
  }

  return {
    title,
    paragraph,
    background,
    icon,
    hintText,
  }
}

const ANJDiscountedMessage = () => {
  const theme = useTheme()
  return (
    <span>
      Your{' '}
      <span
        css={`
          color: ${theme.help};
        `}
      >
        ANJ locked balance
      </span>{' '}
      will be discounted
    </span>
  )
}

const ANJRewardsMessage = ({ isOpen }) => {
  const theme = useTheme()

  const Rewards = (
    <span
      css={`
        color: ${theme.help};
      `}
    >
      rewards
    </span>
  )

  return isOpen ? (
    <span>Your {Rewards} will be available when the dispute is closed</span>
  ) : (
    <span>You can now claim your {Rewards} in the dashboard</span>
  )
}

const VoteInfo = ({ outcome }) => {
  const theme = useTheme()
  return (
    <span>
      You voted{' '}
      <span
        css={`
          text-transform: uppercase;
          color: ${theme.content};
        `}
      >
        {outcome}
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
  )
}

export default DisputeActions

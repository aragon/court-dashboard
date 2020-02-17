import React, { useMemo } from 'react'
import { GU, Help, textStyle, useTheme } from '@aragon/ui'
import { Phase as DisputePhase } from '../../types/dispute-status-types'
import DisputeVoting from './actions/DisputeVoting'
import DisputeDraft from './actions/DisputeDraft'
import DisputeReveal from './actions/DisputeReveal'
import DisputeAppeal from './actions/DisputeAppeal'
import DisputeExecuteRuling from './actions/DisputeExecuteRuling'
import { useWallet } from '../../providers/Wallet'
import {
  getJurorDraft,
  hasJurorVoted,
  canJurorReveal,
} from '../../utils/juror-draft-utils'
import {
  isvoteLeaked,
  voteToString,
  OUTCOMES,
} from '../../utils/crvoting-utils'

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

  const wallet = useWallet()

  if (phase === DisputePhase.Evidence) {
    return null
  }

  if (phase === DisputePhase.JuryDrafting) {
    return <DisputeDraft disputeId={dispute.id} onDraft={onDraft} />
  }

  console.log('dispute', dispute)

  const jurorDraft = getJurorDraft(lastRound, wallet.account) // TODO: Should we also show results for past rounds ?
  const isJurorDrafted = !!jurorDraft

  const jurorHasVoted = isJurorDrafted && hasJurorVoted(jurorDraft)

  if (phase === DisputePhase.VotingPeriod && !jurorHasVoted) {
    return (
      <DisputeVoting
        isJurorDrafted={isJurorDrafted}
        maxAppealReached={dispute.maxAppealReached}
        onRequestCommit={onRequestCommit}
      />
    )
  }

  return (
    <React.Fragment>
      <InformationSection
        phase={phase}
        jurorDraft={jurorDraft}
        hasJurorVoted={jurorHasVoted}
        lastRound={lastRound}
      />
      {(() => {
        // Means juror has already voted
        if (phase === DisputePhase.VotingPeriod) return null

        // If we are past the voting period && juror not drafted
        // or juror drafted and hasn't voted
        if (!isJurorDrafted || !jurorHasVoted) return null

        // If reveal period has already pass
        if (phase !== DisputePhase.RevealVote) return null

        // If juror cannot reveal (has already revealed || voted leaked)
        if (!canJurorReveal(jurorDraft)) return null

        return (
          <DisputeReveal
            disputeId={dispute.id}
            roundId={dispute.lastRoundId}
            commitment={jurorDraft.commitment}
            onRequestReveal={onRequestReveal}
          />
        )
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

function InformationSection({ phase, jurorDraft, hasJurorVoted, lastRound }) {
  const theme = useTheme()

  const { title, paragraph, background, icon, hint } = useInfoAttributes(
    phase,
    jurorDraft,
    hasJurorVoted,
    lastRound,
    theme
  )

  if (!jurorDraft) return null

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
            alt=""
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
const useInfoAttributes = (
  phase,
  jurorDraft,
  hasJurorVoted,
  lastRound,
  theme
) => {
  const positiveBackground = theme.positive.alpha(0.1)
  const negativeBackground = theme.accent.alpha(0.2)

  return useMemo(() => {
    if (!jurorDraft) return {}

    // If the dispute is in the execute ruling phase it means that the final
    // ruling can already be ensured regarding if the ruling was computed or not
    const finalRulingConfirmed = phase === DisputePhase.ExecuteRuling

    // Note that we can assume that the evidence submission and drafting phases have already passed since we do an early return above
    const votingPeriodEnded =
      phase !== DisputePhase.VotingPeriod && phase !== DisputePhase.RevealVote

    const voteLeaked = isvoteLeaked(jurorDraft.outcome)

    // If vote leaked or juror hasn't voted
    if (!hasJurorVoted || voteLeaked) {
      return {
        title: voteLeaked
          ? 'Unfortunately, your vote has been leaked'
          : "Your vote wasn't casted on time.",
        paragraph: <ANJDiscountedMessage />,
        background: negativeBackground,
        icon: IconGavelRed,
        hintText: voteLeaked ? 'Vote leaked (complete)' : null, // TODO: Add hint for leaked vote
      }
    }

    // If juror voted and the voting (commit) period has ended
    if (hasJurorVoted && votingPeriodEnded) {
      // If the juror didn't revealed
      if (!jurorDraft.outcome) {
        return {
          title: "Your vote wasn't revealed on time",
          paragraph: <ANJDiscountedMessage />,
          background: negativeBackground,
          icon: IconGavelRed,
        }
      }

      // Juror has revealed
      // Check if has voted in consensus with the mayority for the last round
      const hasVotedInConsensus =
        lastRound.vote && jurorDraft.outcome === lastRound.vote.winningOutcome

      // We must check if the penalties were already settled so we can tell the jurors
      // wether their ANJ locked balance has been discounted or they can claim rewards
      // Note that if the penalties for the round are settled it means that the dispute has already ended
      const settledPenalties = lastRound.settledPenalties

      const title = hasVotedInConsensus
        ? 'You have voted in consensus with the mayority'
        : 'You have not voted in consensus with the mayority'
      const background = hasVotedInConsensus
        ? positiveBackground
        : negativeBackground

      // If penalties settled then the locked ANJ has been redistributed
      if (settledPenalties) {
        return {
          title,
          paragraph: hasVotedInConsensus ? (
            <ANJRewardsMessage />
          ) : (
            <ANJSlashedMessage />
          ),
          background,
          icon: hasVotedInConsensus ? IconRewardsGreen : IconGavelRed,
        }
      }

      // Includes the cases where penalties weren't settled or the last round hasn't ended
      return {
        title,
        paragraph: (
          <ANJLockedMessage finalRulingConfirmed={finalRulingConfirmed} />
        ),
        background,
        icon: hasVotedInConsensus ? IconGavelOrange : IconGavelRed,
      }
    }

    // Juror has voted and reveal period hasn't ended
    return {
      title: 'Your vote was casted successfuly.',
      paragraph: <VoteInfo outcome={jurorDraft.outcome} />,
      background: theme.accent.alpha(0.05),
      icon: IconGavelOrange,
    }
  }, [
    hasJurorVoted,
    jurorDraft,
    lastRound.settledPenalties,
    lastRound.vote,
    negativeBackground,
    phase,
    positiveBackground,
    theme.accent,
  ])
}

const ANJLockedMessage = ({ finalRulingConfirmed }) => {
  return (
    <ANJMessage
      result={`will remain locked until ${
        finalRulingConfirmed
          ? 'penalties are settled'
          : 'the dispute has been resolved'
      }. `}
    />
  )
}

const ANJDiscountedMessage = () => {
  return <ANJMessage result="will be discounted" />
}

const ANJSlashedMessage = () => {
  return (
    <ANJMessage result="has been slashed and redistributed to other jurors" />
  )
}

const ANJMessage = ({ result }) => {
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
      {result}
    </span>
  )
}

const ANJRewardsMessage = () => {
  const theme = useTheme()

  return (
    <span>
      You can now claim your
      <span
        css={`
          color: ${theme.help};
        `}
      >
        {' '}
        rewards
      </span>{' '}
      in the dashboard.
    </span>
  )
}

const VoteInfo = ({ outcome }) => {
  const theme = useTheme()

  const outcomeDescription = useMemo(() => {
    if (outcome === OUTCOMES.Refused) {
      return { text: 'Refused to vote' }
    }

    return { prefix: 'voted ', text: voteToString(outcome) }
  }, [outcome])

  return (
    <span>
      You {outcomeDescription.prefix}
      <span
        css={`
          text-transform: uppercase;
          color: ${theme.content};
        `}
      >
        {outcomeDescription.text}
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

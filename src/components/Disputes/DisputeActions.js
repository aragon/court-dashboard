import React, { useMemo } from 'react'
import { GU, Help, textStyle, useTheme } from '@aragon/ui'
import {
  Phase as DisputePhase,
  Status as DisputeStatus,
} from '../../types/dispute-status-types'
import DisputeAppeal from './actions/DisputeAppeal'
import DisputeAutoReveal from './DisputeAutoReveal'
import DisputeDraft from './actions/DisputeDraft'
import DisputeExecuteRuling from './actions/DisputeExecuteRuling'
import DisputeReveal from './actions/DisputeReveal'
import DisputeVoting from './actions/DisputeVoting'
import { useWallet } from '../../providers/Wallet'
import {
  getJurorDraft,
  hasJurorVoted,
  canJurorReveal,
} from '../../utils/juror-draft-utils'
import {
  isvoteLeaked,
  voteOptionToString,
  OUTCOMES,
} from '../../utils/crvoting-utils'
import { dateFormat } from '../../utils/date-utils'

import IconGavelOrange from '../../assets/IconGavelOrange.svg'
import IconGavelRed from '../../assets/IconGavelRed.svg'
import { getDisputeLastRound } from '../../utils/dispute-utils'
import IconRewardsGreen from '../../assets/IconRewardsGreen.svg'

function DisputeActions({
  dispute,
  onAutoReveal,
  onDraft,
  onExecuteRuling,
  onRequestCommit,
  onRequestReveal,
  onRequestAppeal,
}) {
  const { phase, status } = dispute
  const lastRound = getDisputeLastRound(dispute)

  const wallet = useWallet()

  if (phase === DisputePhase.Evidence) {
    return null
  }

  if (phase === DisputePhase.JuryDrafting) {
    return <DisputeDraft disputeId={dispute.id} onDraft={onDraft} />
  }

  const jurorDraft = getJurorDraft(lastRound, wallet.account) // TODO: Should we also show results for past rounds ?
  const isJurorDrafted = !!jurorDraft

  const jurorHasVoted = isJurorDrafted && hasJurorVoted(jurorDraft)

  if (phase === DisputePhase.VotingPeriod && !jurorHasVoted) {
    return (
      <DisputeVoting
        draftTermId={lastRound.draftTermId}
        isFinalRound={dispute.maxAppealReached}
        isJurorDrafted={isJurorDrafted}
        onRequestCommit={onRequestCommit}
      />
    )
  }

  return (
    <React.Fragment>
      <InformationSection
        phase={phase}
        status={status}
        jurorDraft={jurorDraft}
        hasJurorVoted={jurorHasVoted}
        lastRound={lastRound}
      />
      {(() => {
        // If connected account not drafted for current dispute
        if (!isJurorDrafted) return null

        // If juror has already voted
        if (phase === DisputePhase.VotingPeriod)
          return (
            <DisputeAutoReveal
              disputeId={dispute.id}
              commitment={jurorDraft.commitment}
              onAutoReveal={onAutoReveal}
              roundId={dispute.lastRoundId}
            />
          )

        // If we are past the voting period && juror hasn't voted
        if (!jurorHasVoted) return null

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

function InformationSection({
  hasJurorVoted,
  jurorDraft,
  lastRound,
  phase,
  status,
}) {
  const theme = useTheme()

  const { title, paragraph, background, icon, hint } = useInfoAttributes({
    hasJurorVoted,
    jurorDraft,
    lastRound,
    phase,
    status,
  })

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
// TODO: Contemplate final round cases (when a juror has voted, the ANJ amount is pre-slashed)
const useInfoAttributes = ({
  hasJurorVoted,
  jurorDraft,
  lastRound,
  phase,
  status,
}) => {
  const theme = useTheme()
  const positiveBackground = theme.positive.alpha(0.1)
  const negativeBackground = theme.accent.alpha(0.2)

  return useMemo(() => {
    if (!jurorDraft) return {}

    // If the dispute is in the execute ruling phase it means that the final ruling can already be ensured.
    // If the dispute is closed it means that the final ruling was already ensured.
    const finalRulingConfirmed =
      status === DisputeStatus.Closed || phase === DisputePhase.ExecuteRuling

    // Note that we can assume that the evidence submission and drafting phases have already passed since we do an early return above
    const votingPeriodEnded =
      phase !== DisputePhase.VotingPeriod && phase !== DisputePhase.RevealVote

    const voteLeaked = isvoteLeaked(jurorDraft.outcome)

    // If vote leaked or juror hasn't voted
    if (!hasJurorVoted || voteLeaked) {
      return {
        title: voteLeaked
          ? 'Unfortunately, your vote has been leaked'
          : 'Your vote wasn’t cast on time.',
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
      // Check if has voted in consensus with the plurality for the last round
      const hasVotedInConsensus =
        lastRound.vote && jurorDraft.outcome === lastRound.vote.winningOutcome

      // We must check if the penalties were already settled so we can tell the jurors
      // wether their ANJ locked balance has been discounted or they can claim rewards
      // Note that if the penalties for the round are settled it means that the dispute has already ended
      const settledPenalties = lastRound.settledPenalties

      const title = hasVotedInConsensus
        ? 'You have voted in consensus with the plurality'
        : 'You have not voted in consensus with the plurality'
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
      title: `Your vote was cast ${
        jurorDraft.outcome ? 'and revealed' : ''
      } successfully.`,
      paragraph: (
        <VoteInfo
          commitmentDate={jurorDraft.commitmentDate}
          outcome={jurorDraft.outcome}
          revealDate={jurorDraft.revealDate}
        />
      ),
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
    status,
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

const VoteInfo = ({ commitmentDate, outcome, revealDate }) => {
  const theme = useTheme()

  const formattedDate = dateFormat(
    new Date(revealDate || commitmentDate),
    'standard'
  )

  const outcomeDescription = useMemo(() => {
    if (outcome === OUTCOMES.Refused) {
      return { text: 'Refused to vote' }
    }

    return { prefix: 'voted ', text: voteOptionToString(outcome) }
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
        {formattedDate}
      </span>
    </span>
  )
}

export default DisputeActions

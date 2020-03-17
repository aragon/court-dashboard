import React from 'react'
import styled from 'styled-components'
import { Button, GU, Info } from '@aragon/ui'
import { useActiveBalanceOfAt } from '../../../hooks/useCourtContracts'
import { useCourtConfig } from '../../../providers/CourtConfig'
import { useWallet } from '../../../providers/Wallet'
import {
  VOTE_OPTION_REFUSE,
  VOTE_OPTION_IN_FAVOR,
  VOTE_OPTION_AGAINST,
} from '../../../utils/crvoting-utils'

function DisputeVoting({
  draftTermId,
  isFinalRound,
  isJurorDrafted,
  onRequestCommit,
}) {
  if (isFinalRound) {
    return (
      <VotingFinalRound
        draftTermId={draftTermId}
        onRequestCommit={onRequestCommit}
      />
    )
  }

  return (
    <VotingActions
      canJurorVote={isJurorDrafted}
      onRequestCommit={onRequestCommit}
    />
  )
}

function VotingFinalRound({ draftTermId, onRequestCommit }) {
  const wallet = useWallet()
  const { minActiveBalance } = useCourtConfig()

  // On a final round we must check if the connected account had the minimum active balance at term `disputeDraftTermId` to be able to vote
  // Note that in a final round, every juror can vote (there's no drafting phase).
  const activeBalance = useActiveBalanceOfAt(wallet.account, draftTermId)

  const canJurorVoteFinalRound = activeBalance.gte(minActiveBalance)

  return (
    <VotingActions
      canJurorVote={canJurorVoteFinalRound}
      onRequestCommit={onRequestCommit}
    />
  )
}

function VotingActions({ canJurorVote, onRequestCommit }) {
  const wallet = useWallet()

  return (
    <div>
      <div
        css={`
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin-bottom: ${1.5 * GU}px;
        `}
      >
        <VotingButton
          mode="positive"
          wide
          disabled={!canJurorVote}
          onClick={() => onRequestCommit(VOTE_OPTION_IN_FAVOR)}
        >
          In favor of the plaintiff
        </VotingButton>
        <VotingButton
          mode="negative"
          wide
          disabled={!canJurorVote}
          onClick={() => onRequestCommit(VOTE_OPTION_AGAINST)}
        >
          Against the plaintiff
        </VotingButton>
        <VotingButton
          wide
          disabled={!canJurorVote}
          onClick={() => onRequestCommit(VOTE_OPTION_REFUSE)}
        >
          Refuse to vote
        </VotingButton>
      </div>
      <Info mode={canJurorVote ? 'description' : 'warning'}>
        {(() => {
          if (!wallet.account)
            return 'You cannot vote on this dispute because your Ethereum account is not connected.'

          return canJurorVote
            ? ' You will be asked a one-time-use code before you can commit your vote.'
            : 'You cannot vote on this dispute with the current enabled address.'
        })()}
      </Info>
    </div>
  )
}

const VotingButton = styled(Button)`
  width: calc((100% - ${2 * GU}px) / 3);
`

export default DisputeVoting

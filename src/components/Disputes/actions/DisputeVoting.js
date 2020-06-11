import React from 'react'
import styled from 'styled-components'
import { Button, GU, Help, Info, useTheme, useViewport } from '@aragon/ui'
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
  const [activeBalance] = useActiveBalanceOfAt(wallet.account, draftTermId)

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
  const { below } = useViewport()
  const compactMode = below('medium')

  const buttonWidth = compactMode ? '100% ' : `calc((100% - ${2 * GU}px) /  3)`

  return (
    <div>
      <div
        css={`
          display: flex;
          justify-content: space-between;
          flex-direction: ${compactMode ? 'column' : 'row'};
          width: 100%;
          margin-bottom: ${1.5 * GU}px;
        `}
      >
        <VotingButton
          compactMode={compactMode}
          disabled={!canJurorVote}
          mode="positive"
          onClick={() => onRequestCommit(VOTE_OPTION_IN_FAVOR)}
          width={buttonWidth}
        >
          Allow action
        </VotingButton>
        <VotingButton
          compactMode={compactMode}
          disabled={!canJurorVote}
          mode="negative"
          onClick={() => onRequestCommit(VOTE_OPTION_AGAINST)}
          width={buttonWidth}
        >
          Block action
        </VotingButton>

        <VotingButton
          compactMode={compactMode}
          disabled={!canJurorVote}
          onClick={() => onRequestCommit(VOTE_OPTION_REFUSE)}
          width={buttonWidth}
        >
          Refuse to vote
        </VotingButton>
      </div>
      <RefuseToVoteHint compactMode={compactMode} width={buttonWidth} />
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

const RefuseToVoteHint = ({ compactMode, width }) => {
  const theme = useTheme()

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        justify-content: ${compactMode ? 'center' : 'flex-end'};
        margin-bottom: ${1.5 * GU}px;
      `}
    >
      <div
        css={`
          width: ${width};
          color: ${theme.help};
        `}
      >
        <Container as={compactMode ? 'label' : 'div'} compactMode={compactMode}>
          <span
            css={`
              margin-right: ${0.5 * GU}px;
            `}
          >
            Why refuse to vote?
          </span>
          <Help hint="">
            <p>
              You can refuse to vote for many reasons, for example if you
              consider that the evidence was not conclusive enough or the
              description was incoherent.
            </p>
            <p>
              Remember that you should vote the way that you think the plurality
              of jurors will vote, since you will be penalized if your vote is
              in the minority.
            </p>
          </Help>
        </Container>
      </div>
    </div>
  )
}

const VotingButton = styled(Button)`
  width: ${({ width }) => width};
  margin-bottom: ${({ compactMode }) => (compactMode ? 1 : 0) * GU}px;
`

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ compactMode }) => (compactMode ? 'pointer' : '')};
`

export default DisputeVoting

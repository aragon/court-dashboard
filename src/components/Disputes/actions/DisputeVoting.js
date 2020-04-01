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

          & > button {
            width: ${buttonWidth};
            margin-bottom: ${(compactMode ? 1 : 0) * GU}px;
          }
        `}
      >
        <Button
          mode="positive"
          wide
          disabled={!canJurorVote}
          onClick={() => onRequestCommit(VOTE_OPTION_IN_FAVOR)}
        >
          Allow action
        </Button>
        <Button
          mode="negative"
          wide
          disabled={!canJurorVote}
          onClick={() => onRequestCommit(VOTE_OPTION_AGAINST)}
        >
          Block action
        </Button>

        <Button
          wide
          disabled={!canJurorVote}
          onClick={() => onRequestCommit(VOTE_OPTION_REFUSE)}
        >
          Refuse to vote
        </Button>
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

  const Container = compactMode ? Label : 'div'

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
        <Container
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            css={`
              margin-right: ${0.5 * GU}px;
            `}
          >
            Why refuse to vote?
          </span>
          <Help hint="">
            You can refuse to vote for many reasons, for example if you consider
            that the evidence was not conclusive enough or the description was
            incoherent. In any case, you won’t be penalized at this stage for
            selecting any of these options. Remember that you should vote the
            way that you think a majority of jurors will vote, since you will be
            penalized if your vote is in the minority.
          </Help>
        </Container>
      </div>
    </div>
  )
}

const Label = styled.label`
  cursor: pointer;
`

export default DisputeVoting

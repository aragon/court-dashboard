import React from 'react'
import styled from 'styled-components'
import { Button, GU, Info } from '@aragon/ui'
import { useWallet } from '../../../providers/Wallet'
import useCanJurorVoteFinalRound from '../../../hooks/useCanJurorVoteFinalRound'
import {
  VOTE_OPTION_REFUSE,
  VOTE_OPTION_IN_FAVOR,
  VOTE_OPTION_AGAINST,
} from '../../../utils/crvoting-utils'

function DisputeVoting({ isJurorDrafted, maxAppealReached, onRequestCommit }) {
  const wallet = useWallet()

  // If max appeal reached (final round) then we will check if the connected account has the minimum active balance to be able to vote
  // Note that in a final round, every juror can vote (there's no drafting phase).
  const canJurorVoteFinalRound = useCanJurorVoteFinalRound(wallet.account, {
    pause: !wallet.account || !maxAppealReached,
  })

  const canJurorVote = isJurorDrafted || canJurorVoteFinalRound

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
          In favor
        </VotingButton>
        <VotingButton
          mode="negative"
          wide
          disabled={!canJurorVote}
          onClick={() => onRequestCommit(VOTE_OPTION_AGAINST)}
        >
          Against
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

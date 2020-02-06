import React from 'react'
import styled from 'styled-components'
import { Button, GU, Info } from '@aragon/ui'

import { useConnectedAccount } from '../../../providers/Web3'

import {
  VOTE_OPTION_REFUSE,
  VOTE_OPTION_IN_FAVOR,
  VOTE_OPTION_AGAINST,
} from '../../../utils/crvoting-utils'

function DisputeVoting({ isJurorDrafted, onRequestCommit }) {
  const connectedAccount = useConnectedAccount()

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
          disabled={!isJurorDrafted}
          onClick={() => onRequestCommit(VOTE_OPTION_IN_FAVOR)}
        >
          In favor
        </VotingButton>
        <VotingButton
          mode="negative"
          wide
          disabled={!isJurorDrafted}
          onClick={() => onRequestCommit(VOTE_OPTION_AGAINST)}
        >
          Against
        </VotingButton>
        <VotingButton
          wide
          disabled={!isJurorDrafted}
          onClick={() => onRequestCommit(VOTE_OPTION_REFUSE)}
        >
          Refuse to vote
        </VotingButton>
      </div>
      <Info mode={isJurorDrafted ? 'description' : 'warning'}>
        {(() => {
          if (!connectedAccount)
            return 'You cannot vote on this dispute because your Ethereum account is not connected.'

          return isJurorDrafted
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

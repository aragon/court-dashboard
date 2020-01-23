import React from 'react'
import styled from 'styled-components'
import { Button, GU, Info, textStyle } from '@aragon/ui'

import {
  VOTE_OPTION_REFUSE,
  VOTE_OPTION_IN_FAVOUR,
  VOTE_OPTION_AGAINST,
} from '../../../utils/crvoting-utils'

function DisputeVoting({ isJurorDrafted, onRequestCommit }) {
  return (
    <div>
      <div
        css={`
          display: flex;
          width: 100%;
          margin-bottom: ${1.5 * GU}px;
        `}
      >
        <VotingButton
          mode="positive"
          wide
          disabled={!isJurorDrafted}
          onClick={() => onRequestCommit(VOTE_OPTION_IN_FAVOUR)}
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
        {isJurorDrafted
          ? ' You will be asked a password before you can commit your vote.'
          : 'You cannot vote on this dispute with the current enabled address.'}
      </Info>
    </div>
  )
}

const VotingButton = styled(Button)`
  ${textStyle('body2')};
  width: 50%;
  margin-right: ${1 * GU}px;
  &:last-child {
    margin-right: 0px;
  }
`

export default DisputeVoting

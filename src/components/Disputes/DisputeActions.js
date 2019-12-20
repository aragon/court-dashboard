import React from 'react'
import * as DisputesTypes from './types'
import { addressesEqual } from '../Lib/web3'
import { Button, Info, textStyle, GU } from '@aragon/ui'
import styled from 'styled-components'

const DisputeActions = React.memo(({ dispute }) => {
  const { currentPhase, rounds } = dispute
  console.log('EVENT ', currentPhase)
  console.log('PHASE ', DisputesTypes.Phase.VotingPeriod)
  const connectedAccount = '0xe11ba2b4d45eaed5996cd0823791e0c93114882d'

  if (currentPhase === DisputesTypes.Phase.Evidence) {
    return null
  }

  if (currentPhase === DisputesTypes.Phase.VotingPeriod) {
    const canJurorVote = rounds[rounds.length - 1].jurors.some(j =>
      addressesEqual(j.juror.id, connectedAccount)
    )

    return (
      <React.Fragment>
        <div
          css={`
            display: flex;
            flex-direction: column;
            margin-bottom: ${2 * GU}px;
          `}
        >
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
              disabled={!canJurorVote}
              onClick={() => {}}
            >
              In favor
            </VotingButton>
            <VotingButton
              mode="negative"
              wide
              disabled={!canJurorVote}
              onClick={() => {}}
            >
              Against
            </VotingButton>
            <VotingButton wide disabled={!canJurorVote} onClick={() => {}}>
              Refuse to vote
            </VotingButton>
          </div>

          <Info mode={canJurorVote ? 'description' : 'warning'}>
            {canJurorVote
              ? ' You will be asked a password before you can commit your vote.'
              : 'You cannot vote on this dispute with the current enabled address.'}
          </Info>
        </div>
      </React.Fragment>
    )
  }
})

const VotingButton = styled(Button)`
  ${textStyle('body2')};
  width: 50%;
  margin-right: ${1 * GU}px;
  &:last-child {
    margin-right: 0px;
  }
`

export default DisputeActions

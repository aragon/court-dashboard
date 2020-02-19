import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Card, GU, textStyle, useTheme } from '@aragon/ui'

import DisputeText from './DisputeText'
import DisputeStatus from './DisputeStatus'
import DisputePhase from './DisputePhase'

import { Status } from '../../types/dispute-status-types'

function DisputeCard({ dispute, onSelectDispute }) {
  const theme = useTheme()
  const {
    id,
    description,
    finalRuling,
    nextTransition,
    phase,
    voidedText,
  } = dispute
  const handleClick = useCallback(() => {
    onSelectDispute(id)
  }, [id, onSelectDispute])

  return (
    <CardItem onClick={handleClick}>
      <div>
        <DisputeStatus dispute={dispute} />
      </div>
      <div
        css={`
          align-self: flex-start;
          & > * {
            margin-bottom: ${1 * GU}px;
          }
        `}
      >
        <h3
          css={`
            ${textStyle('body1')}
          `}
        >
          <strong> Dispute #{id}</strong>
        </h3>
        <DisputeText
          text={voidedText || description}
          css={`
            overflow: hidden;
            ${textStyle('body2')};
            color: ${theme.content};
            line-height: ${27}px; // 27px = line-height of textstyle('body1')
            height: ${27 * 3}px; // 27px * 3 = line-height * 3 lines
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
          `}
        />
        {dispute.status !== Status.Voided && (
          <DisputePhase
            finalRuling={finalRuling}
            nextTransition={nextTransition}
            phase={phase}
          />
        )}
      </div>
    </CardItem>
  )
}

const CardItem = styled(Card)`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: ${3 * GU}px auto;
  grid-gap: ${1 * GU}px;
  padding: ${3 * GU}px;
  box-shadow: rgba(51, 77, 117, 0.2) 0px 1px 3px;
  border: 0;
`

export default DisputeCard

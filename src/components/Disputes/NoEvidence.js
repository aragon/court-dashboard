import React from 'react'
import { EmptyStateCard } from '@aragon/ui'
import noEvidencePng from '../../assets/noEvidence.png'

function NoEvidence() {
  return (
    <EmptyStateCard
      text="The evidence is being presented"
      illustration={
        <img
          css={`
            margin: auto;
            height: 170px;
          `}
          src={noEvidencePng}
          alt="The involved parties have up to 7 days to submitt evidence supporting their case"
        />
      }
    />
  )
}

export default NoEvidence

import React from 'react'
import { Box, textStyle, GU, useTheme } from '@aragon/ui'

import noEvidenceSvg from '../../assets/noEvidence.svg'

function NoEvidence() {
  const theme = useTheme()
  return (
    <Box>
      <div
        css={`
          margin: ${15 * GU}px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <img
          src={noEvidenceSvg}
          alt="No Evidence"
          css={`
            display: block;
            width: 100%;
            max-width: 237px;
            height: auto;
            margin: ${4 * GU}px 0;
          `}
        />
        <span
          css={`
            ${textStyle('title2')}
          `}
        >
          The evidence is being presented
        </span>
        <div
          css={`
            ${textStyle('body2')}
            color: ${theme.contentSecondary};
            margin-top: ${GU * 1.5}px;
            width: 450px;
            display: flex;
            text-align: center; 
          `}
        >
          The involved parties have up to 7 days to submit evidence supporting
          their case
        </div>
      </div>
    </Box>
  )
}

export default NoEvidence

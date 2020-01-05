import React from 'react'
import { Box, textStyle, GU, useTheme } from '@aragon/ui'
import noEvidencePng from '../../assets/noEvidence.png'

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
          css={`
            margin: ${4 * GU}px 0;
            height: 176px;
          `}
          src={noEvidencePng}
          alt="No Evidence"
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
          The involved parties have up to 7 days to submitt evidence supporting
          their case
        </div>
      </div>
    </Box>
  )
}

export default NoEvidence

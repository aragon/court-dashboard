import React from 'react'
import { Button, GU, textStyle, useTheme } from '@aragon/ui'
import iconWarningSvg from '../../assets/IconWarning.svg'

function DisputeVoided({ id, text, link }) {
  const theme = useTheme()

  return (
    <div
      css={`
        padding: 0px ${11 * GU}px;
        margin-bottom: ${4 * GU}px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
      `}
    >
      <div
        css={`
          display: grid;
          grid-row-gap: ${2 * GU}px;
        `}
      >
        <h1
          css={`
            ${textStyle('title1')}
            font-weight: normal;
          `}
        >
          Void Notice for Dispute #{id}
        </h1>
        <span
          css={`
            color: ${theme.contentSecondary};
          `}
        >
          {text}
        </span>
        <Button
          label="Read more"
          href={link}
          mode="strong"
          css={`
            width: ${22 * GU}px;
          `}
        />
      </div>
      <img src={iconWarningSvg} alt="" height={40 * GU} />
    </div>
  )
}

export default DisputeVoided

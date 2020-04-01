import React from 'react'
import { Button, GU, Info, textStyle, useTheme } from '@aragon/ui'

function ConfirmTransaction({ onSign, description }) {
  const theme = useTheme()

  return (
    <div>
      <Info>
        <h4
          css={`
            ${textStyle('label2')};
            margin-bottom: ${0.5 * GU}px;
          `}
        >
          Action to be triggered
        </h4>
        <span
          css={`
            color: ${theme.content};
          `}
        >
          {description}
        </span>
      </Info>
      <Button
        label="Create transaction"
        mode="strong"
        wide
        onClick={onSign}
        css={`
          margin-top: ${2 * GU}px;
        `}
      />
    </div>
  )
}

export default ConfirmTransaction

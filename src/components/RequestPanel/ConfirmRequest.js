import React from 'react'
import { Button, GU, Info, textStyle, useTheme } from '@aragon/ui'

function ConfirmRequest({ descriptions, onStartRequest }) {
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
          Action{descriptions.length > 0 ? 's' : ''} to be triggered
        </h4>
        <div
          css={`
            color: ${theme.content};
          `}
        >
          {descriptions.length > 1 ? (
            <ul
              css={`
                padding: 0px ${1 * GU}px;
                margin-top: ${0.5 * GU}px;
                list-style: none;
              `}
            >
              {descriptions.map((description, index) => (
                <li key={index}>
                  <span
                    css={`
                      font-weight: bold;
                      margin-right: ${0.5 * GU}px;
                    `}
                  >
                    -
                  </span>
                  {description}
                </li>
              ))}
            </ul>
          ) : (
            <span>{descriptions[0]}</span>
          )}
        </div>
      </Info>
      <Button
        label="Confirm"
        mode="strong"
        wide
        onClick={onStartRequest}
        css={`
          margin-top: ${2 * GU}px;
        `}
      />
    </div>
  )
}

export default ConfirmRequest

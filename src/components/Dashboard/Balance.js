import React from 'react'
import { GU, textStyle, useTheme } from '@aragon/ui'
import ANJIcon from '../../assets/anj.svg'

export default function Balance({
  label,
  amount,
  value,
  mainIcon,
  mainIconBackground,
  activity,
  actions,
}) {
  const theme = useTheme()

  return (
    <div
      css={`
        border-bottom: 1px solid ${theme.border.alpha(0.7)};
      `}
    >
      <div
        css={`
          display: flex;
          align-items: flex-start;
          padding: ${2 * GU}px 0;
        `}
      >
        <div
          css={`
            padding: ${1.5 * GU}px;
            background: ${mainIconBackground};
            border-radius: 50%;
            margin-right: ${2 * GU}px;
          `}
        >
          <img
            css={`
              display: block;
            `}
            src={mainIcon}
          />
        </div>
        <div>
          <span
            css={`      
            ${textStyle('body2')}
            color: ${theme.contentSecondary};
            display:block;
          `}
          >
            {label}
          </span>
          <span
            css={`
              ${textStyle('title3')}
              line-height: 1.2;
              display: block;
            `}
          >
            {amount} <img src={ANJIcon} />
          </span>{' '}
          <span
            css={`
            ${textStyle('body4')}
            color: ${theme.contentSecondary};
            display:block;
          `}
          >
            $ {value}
          </span>
        </div>
      </div>
    </div>
  )
}

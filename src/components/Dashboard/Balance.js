import React from 'react'
import { Button, GU, textStyle, useTheme } from '@aragon/ui'
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
    <div>
      <div
        css={`
          border-bottom: 1px solid ${theme.border.alpha(0.7)};
        `}
      >
        <div
          css={`
            display: flex;
            align-items: flex-start;
            padding-bottom: ${2 * GU}px;
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
              height={3 * GU}
              width={3 * GU}
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
      <div
        css={`
          margin: ${2 * GU}px 0;
          color: ${theme.contentSecondary};
        `}
      >
        {activity ? (
          <span>Recent activity</span>
        ) : (
          <span>No recent 24h activity</span>
        )}
      </div>

      {amount > '0' && (
        <div
          css={`
            display: flex;
          `}
        >
          {actions.map((action, index) => {
            return (
              <Button
                key={index}
                label={action.label}
                mode={action.mode}
                onClick={action.onClick} // eslint-disable-line
                wide
                css={`
                  &:first-child {
                    margin-right: ${GU}px;
                  }
                `}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

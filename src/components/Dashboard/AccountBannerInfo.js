import React from 'react'
import { GU, textStyle, Timer, useTheme } from '@aragon/ui'
import { useClock } from '../../providers/Clock'

function AccountBannerInfo({ title, titleColor = '', paragraph, showTimer }) {
  const theme = useTheme()
  const { currentTermEndDate } = useClock()
  return (
    <div
      css={`
        display: flex;
        width: 100%;
        justify-content: space-between;
      `}
    >
      <div
        css={`
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          height: ${6 * GU}px;
        `}
      >
        <span
          css={`
    ${textStyle('title4')}
    color: ${titleColor};
  `}
        >
          {title}
        </span>
        <span
          css={`
            color: ${theme.contentSecondary};
            display: block;
          `}
        >
          {paragraph}
        </span>
      </div>
      {showTimer && <Timer format="hms" end={currentTermEndDate} />}
    </div>
  )
}

export default AccountBannerInfo
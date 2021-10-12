import React from 'react'
import { textStyle, Timer, useTheme } from '@aragon/ui'
import { useCourtClock } from '../../providers/CourtClock'

function AccountBannerInfo({ title, titleColor = '', paragraph, showTimer }) {
  const theme = useTheme()
  const { currentTermEndDate } = useCourtClock()
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
            color: ${theme.surfaceContentSecondary};
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

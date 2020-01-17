import React from 'react'
import { GU, textStyle, useTheme } from '@aragon/ui'

function AccountBannerInfo({ title, titleColor = '', paragraph }) {
  const theme = useTheme()
  return (
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
  )
}

export default AccountBannerInfo

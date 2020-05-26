import React from 'react'
import { GU, textStyle, useTheme } from '@aragon/ui'

import emailIllustration from '../../assets/emailIllustration.svg'

const VerifyEmailAddress = React.memo(function VerifyEmailAddress({ email }) {
  const theme = useTheme()

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: ${5 * GU}px;
      `}
    >
      <div
        css={`
          display: flex;
          flex-direction: column;
          text-align: center;
        `}
      >
        <img src={emailIllustration} />
        <span
          css={`
            ${textStyle('title2')};
            margin-top: ${4 * GU}px;
          `}
        >
          Cannot connect to Notifications server
        </span>

        <span
          css={`
            ${textStyle('body2')};
            color: ${theme.surfaceContentSecondary};
            margin-top: ${1.5 * GU}px;
          `}
        >
          There was a problem when trying to connect to the Email Notifications
          server. Make sure your Internet connection is working and please try
          again.
        </span>
      </div>
    </div>
  )
})

export default VerifyEmailAddress

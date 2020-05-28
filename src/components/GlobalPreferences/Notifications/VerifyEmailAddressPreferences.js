import React from 'react'
import { Button, GU, textStyle, useTheme, useViewport } from '@aragon/ui'
import emailIllustration from '../../../../src/assets/emailIllustration.svg'

const VerifyEmailAddressPreferences = React.memo(
  function VerifyEmailAddressPreferences({ email, onResend }) {
    const theme = useTheme()
    const { below } = useViewport()
    const compact = below('medium')

    return (
      <div
        css={`
          display: flex;
          flex-direction: column;
          text-align: center;
          align-items: center;
        `}
      >
        <div>
          <img src={emailIllustration} width={181} height={181} alt="" />
        </div>
        <h3
          css={`
            ${textStyle('title2')};
            margin-top: ${4 * GU}px;
          `}
        >
          Verify your email address
        </h3>
        <span
          css={`
            ${textStyle('body2')};
            color: ${theme.surfaceContentSecondary};
            margin-top: ${1.5 * GU}px;
            padding: 0px ${(compact ? 3 : 20) * GU}px;
          `}
        >
          Almost there! We’ve sent a verification email to{' '}
          <strong>{email}</strong>. Kindly check your inbox and click the link
          to verify your account.
        </span>

        <Button
          css={`
            margin-top: ${3 * GU}px;
            width: ${35 * GU}px;
          `}
          mode="strong"
          onClick={onResend}
        >
          Resend verification email
        </Button>
      </div>
    )
  }
)

export default VerifyEmailAddressPreferences

import React, { useCallback, useEffect, useState } from 'react'
import {
  Button,
  Checkbox,
  GU,
  Link,
  textStyle,
  useInside,
  useTheme,
  useViewport,
} from '@aragon/ui'
import { useWallet } from '../../providers/Wallet'
import { useInput } from '../../hooks/useInput'
import IdentityBadge from '../IdentityBadge'
import EmailInput from './EmailInput'
import { validateEmail } from '../../utils/validate-utils'

import emailNotifcationIllustration from '../../../src/assets/emailNotifications.svg'

function EmailNotificationsForm({
  existingEmail,
  onOptOut,
  onSubscribeToNotifications,
}) {
  const [error, setError] = useState()
  const [termsAccepted, setTermsAccepted] = useState(false)

  const theme = useTheme()
  const { account } = useWallet()
  const [insideModal] = useInside('NotificationsModal')
  const { below } = useViewport()
  const compactMode = below('medium')

  const { inputProps, status } = useInput(validateEmail)

  const emailInvalid = status === 'invalid'

  const handleOnSubscribeToNotifications = useCallback(
    e => {
      e.preventDefault()
      if (inputProps.value === existingEmail) {
        setError('Email already exists.')
        return
      }
      onSubscribeToNotifications(inputProps.value)
    },
    [onSubscribeToNotifications, existingEmail, inputProps.value]
  )

  const handleOnTermsChange = useCallback(() => {
    setTermsAccepted(!termsAccepted)
  }, [setTermsAccepted, termsAccepted])

  useEffect(() => {
    if (inputProps.value !== existingEmail) {
      return setError('')
    }
  }, [inputProps.value, existingEmail])

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-top: ${insideModal ? 3 : 0 * GU}px;
      `}
    >
      <div
        css={`
          display: flex;
          flex-direction: column;
          text-align: center;
        `}
      >
        <div
          css={`
            align-items: center;
          `}
        >
          <img
            src={emailNotifcationIllustration}
            width="141"
            height="141"
            alt=""
          />
        </div>
        <span
          css={`
            ${textStyle('title2')};
            margin-top: ${4 * GU}px;
          `}
        >
          {existingEmail
            ? `Update "${existingEmail}"`
            : 'Stay up to date with email notifications'}
        </span>

        <span
          css={`
            ${textStyle('body2')};
            color: ${theme.surfaceContentSecondary};
            margin-top: ${1.5 * GU}px;
          `}
        >
          {existingEmail ? (
            <>
              <span>Enter a new email address for your account</span>
              <IdentityBadge entity={account} compact />
              <span>
                . We will continue sending email notifications to the current
                email address until you verify this new email address.
              </span>
            </>
          ) : (
            <>
              <span>Associate an email address to your account </span>
              <IdentityBadge entity={account} compact />
              <span>
                , so you can receive notifications for all Aragon Court events.
              </span>
            </>
          )}
        </span>

        <div
          css={`
            margin-top: ${5 * GU}px;
          `}
        >
          <EmailInput
            existingEmail={existingEmail}
            status={status}
            {...inputProps}
          />

          {error && (
            <div>
              <p
                css={`
                  color: ${theme.negative};
                  ${textStyle('body4')};
                  text-align: left;
                  height: 0;
                  margin-top: ${0.5 * GU}px;
                `}
              >
                {error}
              </p>
            </div>
          )}
        </div>
      </div>
      <LegalTermsAndPolicy
        termsAccepted={termsAccepted}
        onChange={handleOnTermsChange}
      />

      {insideModal ? (
        <div
          css={`
            display: flex;
            justify-content: space-between;
            flex-direction: ${compactMode ? 'column' : 'row'};
            width: 100%;
            margin-bottom: ${1.5 * GU}px;
            margin-top: ${3 * GU}px;
          `}
        >
          <ActionButton compactMode={compactMode} onClick={onOptOut}>
            No, thanks
          </ActionButton>
          <ActionButton
            compactMode={compactMode}
            mode="strong"
            type="submit"
            disabled={emailInvalid || !termsAccepted}
            onClick={handleOnSubscribeToNotifications}
          >
            Subscribe
          </ActionButton>
        </div>
      ) : (
        <Button
          css={`
            margin-top: ${2.5 * GU}px;
          `}
          mode="strong"
          disabled={emailInvalid || !termsAccepted}
          onClick={handleOnSubscribeToNotifications}
          size="medium"
        >
          {existingEmail ? 'Update' : 'Subscribe to email notifications'}
        </Button>
      )}
    </div>
  )
}

const LegalTermsAndPolicy = React.memo(function LegalTermsAndPolicy({
  termsAccepted,
  onChange,
}) {
  return (
    <div
      css={`
        margin-top: ${3 * GU}px;
      `}
    >
      <div
        css={`
          display: flex;
        `}
      >
        <div>
          <Checkbox checked={termsAccepted} onChange={onChange} />
        </div>
        <span
          css={`
            ${textStyle('body2')};
            color: #9096b6;
            margin-left: ${1.5 * GU}px;
            text-align: left;
          `}
        >
          By continuing with your email, you agree to Aragon Court's{' '}
          <Link href="https://anj.aragon.org/legal/terms-general.pdf">
            legal terms
          </Link>{' '}
          and{' '}
          <Link href="https://aragon.one/email-collection.md">
            email collection policy
          </Link>
          .
        </span>
      </div>
    </div>
  )
})

function ActionButton({ compactMode, ...props }) {
  return (
    <Button
      css={`
        width: ${compactMode ? '100%' : `calc((100% - ${2 * GU}px) /  2)`};
      `}
      {...props}
    />
  )
}

export default EmailNotificationsForm

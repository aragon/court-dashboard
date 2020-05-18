import React, { useCallback, useState } from 'react'
import {
  Button,
  Checkbox,
  Field,
  GU,
  IconCheck,
  IconCross,
  Link,
  TextInput,
  textStyle,
  useInside,
  useTheme,
  useViewport,
} from '@aragon/ui'
import { useWallet } from '../../providers/Wallet'
import IdentityBadge from '../IdentityBadge'
import { validateEmail } from '../../utils/validate-utils'

import emailNotifcationIllustration from '../../../src/assets/emailNotifications.svg'

function EmailNotificationsForm({
  existingEmail,
  onOptOut,
  onSubscribeToNotifications,
}) {
  const [emailAddress, setEmailAddress] = useState('')
  const [emailInvalid, setEmailInvalid] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const theme = useTheme()
  const { account } = useWallet()
  const [insideModal] = useInside('Modal')
  const { below } = useViewport()
  const compactMode = below('medium')

  const handleEmailAddressBlur = useCallback(e => {
    const email = e.target.value
    setEmailInvalid(!validateEmail(email))
  }, [])

  const handleEmailAddressChange = useCallback(e => {
    const email = e.target.value
    setEmailAddress(email)
    if (validateEmail(email)) {
      // Set only as valid while user typing. Use blur to set invalid
      setEmailInvalid(false)
    }
  }, [])

  const handleOnSubscribeToNotifications = useCallback(
    e => {
      e.preventDefault()
      onSubscribeToNotifications(emailAddress)
    },
    [emailAddress, onSubscribeToNotifications]
  )

  const handleOnTermsChange = useCallback(() => {
    setTermsAccepted(!termsAccepted)
  }, [setTermsAccepted, termsAccepted])

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
              <IdentityBadge
                connectedAccount={account}
                entity={account}
                compact
              />
              <span>
                . We will continue sending email notifications to the current
                email address until you verify this new email address.
              </span>
            </>
          ) : (
            <>
              <span>Associate an email address to your account </span>
              <IdentityBadge
                connectedAccount={account}
                entity={account}
                compact
              />
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
          <div
            css={`
              display: flex;
              flex-direction: row;
              justify-content: space-between;
            `}
          >
            <Field
              label={
                existingEmail
                  ? 'Enter new email address'
                  : 'Enter email address'
              }
              css={`
                width: 100%;
                margin-bottom: 0;
              `}
            >
              <TextInput
                value={emailAddress}
                adornment={
                  emailInvalid ? (
                    <IconCross
                      css={`
                        color: ${theme.negative};
                      `}
                    />
                  ) : (
                    <IconCheck
                      css={`
                        opacity: ${emailAddress.trim() ? '1' : '0'};
                        color: ${theme.positive};
                      `}
                    />
                  )
                }
                adornmentPosition="end"
                type="email"
                wide
                onChange={handleEmailAddressChange}
                placeholder="you@example.org"
                onBlur={handleEmailAddressBlur}
              />
            </Field>

            {!insideModal && (
              <div
                css={`
                  display: flex;
                  align-items: flex-end;
                  margin-left: ${2 * GU}px;
                `}
              >
                <Button
                  mode="strong"
                  disabled={emailInvalid || !termsAccepted}
                  onClick={handleOnSubscribeToNotifications}
                  size="medium"
                >
                  {existingEmail ? 'Update' : 'Subscribe'}
                </Button>
              </div>
            )}
          </div>

          {emailInvalid && (
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
                Please enter a valid email address.
              </p>
            </div>
          )}
        </div>
      </div>
      <LegalTermsAndPolicy
        termsAccepted={termsAccepted}
        onChange={handleOnTermsChange}
      />

      {insideModal && (
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
            Opt out
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
      )}
    </div>
  )
}

const LegalTermsAndPolicy = React.memo(function LegalTermsAndPolicy({
  termsAccepted,
  onChange,
}) {
  console.log('terms accepted ', termsAccepted)
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

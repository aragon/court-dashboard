import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
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
  useTheme,
} from '@aragon/ui'
import LocalIdentityBadge from '../LocalIdentityBadge/LocalIdentityBadge'
import { addressesEqual, transformAddresses } from '../../lib/web3-utils'
import { validateEmail } from '../../utils/notifications-utils'

import emailNotifcationIllustration from '../../../src/assets/emailNotifications.svg'

function EmailNotificationsForm({
  account,
  compactMode,
  emailExists,
  onError,
  onGetExistingEmail,
  onOptOut,
  onOptOutNeedsSignature,
  onSubscribeNeedsSignature,
  onSubscribeSuccess,
  onSubscribeToNotifications,
}) {
  const [emailAddress, setEmailAddress] = useState('')
  const [emailInvalid, setEmailInvalid] = useState(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const theme = useTheme()

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

  const handleOnSubscribeToNotifications = useCallback(async () => {
    let email = emailAddress

    if (emailExists) {
      const {
        needsSignature,
        email: existingEmail,
        error: errorGettingEmail,
      } = await onGetExistingEmail()

      if (errorGettingEmail && !needsSignature) {
        onError()
        return
      }
      email = existingEmail
    }

    const {
      subscribedEmail,
      needsSignature: subscribeNeedsSignature,
      error: errorSubscribing,
    } = await onSubscribeToNotifications(email)

    if (errorSubscribing && !subscribeNeedsSignature) {
      onError()
      return
    }

    if (subscribeNeedsSignature) {
      onSubscribeNeedsSignature(emailAddress)
      return
    }

    onSubscribeSuccess(subscribedEmail)
  }, [
    emailAddress,
    emailExists,
    onError,
    onGetExistingEmail,
    onSubscribeNeedsSignature,
    onSubscribeSuccess,
    onSubscribeToNotifications,
  ])

  const handleOnOptOut = useCallback(async () => {
    const { error, needsSignature } = await onOptOut()

    if (error && !needsSignature) {
      onError()
      return
    }

    if (needsSignature) {
      onOptOutNeedsSignature()
    }
  }, [onError, onOptOut, onOptOutNeedsSignature])

  return (
    <>
      <div
        css={`
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-top: ${3 * GU}px;
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
              width={141}
              height={141}
              alt=""
            />
          </div>
          <span
            css={`
              ${textStyle('title2')};
              margin-top: ${4 * GU}px;
            `}
          >
            Stay up to date with email notifications
          </span>

          <TextContent emailExists={emailExists} account={account} />
          {!emailExists && (
            <div
              css={`
                margin-top: ${5 * GU}px;
              `}
            >
              <Field label="Enter email address">
                <TextInput
                  value={emailAddress}
                  adornment={
                    emailInvalid === false ? (
                      <IconCheck
                        css={`
                          color: ${theme.positive};
                        `}
                      />
                    ) : emailAddress.trim() ? (
                      <IconCross
                        css={`
                          color: ${theme.negative};
                        `}
                      />
                    ) : (
                      <IconCheck
                        css={`
                          opacity: 0;
                        `}
                      />
                    )
                  }
                  adornmentPosition="end"
                  type="email"
                  wide
                  onChange={handleEmailAddressChange}
                  placeholder="email@address.com"
                  onBlur={handleEmailAddressBlur}
                />
                {emailInvalid && (
                  <div>
                    <p
                      css={`
                        color: ${theme.negative};
                        ${textStyle('body4')};
                        float: left;
                        margin-top: ${0.5 * GU}px;
                      `}
                    >
                      Please enter a valid email address.
                    </p>
                  </div>
                )}
              </Field>
            </div>
          )}
        </div>
        <LegalTermsAndPolicy
          emailExists={emailExists}
          termsAccepted={termsAccepted}
          setTermsAccepted={setTermsAccepted}
          theme={theme}
        />
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
          <ActionButtons compactMode={compactMode} onClick={handleOnOptOut}>
            Opt out
          </ActionButtons>
          <ActionButtons
            compactMode={compactMode}
            mode="strong"
            disabled={emailExists ? false : emailInvalid || !termsAccepted}
            onClick={handleOnSubscribeToNotifications}
          >
            {emailExists ? 'Subscribe to notifications' : 'Subscribe'}
          </ActionButtons>
        </div>
      </div>
    </>
  )
}

function TextContent({ emailExists, account }) {
  const theme = useTheme()
  let content

  if (emailExists) {
    content = `We’ve detected an email associated to the account ${account}                                      
        Please verify it, so you will get notifications from all Aragon Court events. 
        You can also update it, or delete it if you wish to unsubscribe.`
  }
  content = `Associate an email address to your account ${account}, so you can get notifications from all Aragon Court events.`

  return (
    <span
      css={`
        ${textStyle('body2')};
        color: ${theme.surfaceContentSecondary};
        margin-top: ${1.5 * GU}px;
      `}
    >
      {transformAddresses(content, (part, isAddress, index) =>
        isAddress ? (
          <span title={part} key={index}>
            <LocalIdentityBadge
              connectedAccount={addressesEqual(part, account)}
              entity={part}
              compact
            />
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  )
}

function LegalTermsAndPolicy({
  emailExists,
  termsAccepted,
  setTermsAccepted,
  theme,
}) {
  const text = emailExists
    ? 'You have previously agreed to Aragon court '
    : 'By continuing with your email, you agree to Aragon court '

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
        {!emailExists && (
          <Checkbox
            checked={termsAccepted}
            onChange={checked => setTermsAccepted(checked)}
          />
        )}

        <span
          css={`
            ${textStyle('body2')};
            color: ${theme.surfaceContentSecondary};
            margin-left: ${1.5 * GU}px;
            text-align: ${emailExists ? 'center' : 'left'};
          `}
        >
          {text}
          <Link href="#">legal terms </Link> and{' '}
          <Link href="#"> email collection policy.</Link>
        </span>
      </div>
    </div>
  )
}

const ActionButtons = styled(Button)`
  width: ${({ compactMode }) =>
    compactMode ? '100% ' : `calc((100% - ${2 * GU}px) /  2)`};
`

export default EmailNotificationsForm

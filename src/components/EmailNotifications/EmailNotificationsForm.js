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
  useInside,
  useTheme,
} from '@aragon/ui'
import { useWallet } from '../../providers/Wallet'
import IdentityBadge from '../IdentityBadge'
import { addressesEqual, transformAddresses } from '../../lib/web3-utils'
import { validateEmail } from '../../utils/notifications-utils'

import emailNotifcationIllustration from '../../../src/assets/emailNotifications.svg'

function EmailNotificationsForm({
  compactMode,
  existingEmail,
  onOptOut,
  onSubscribeToNotifications,
}) {
  const [emailAddress, setEmailAddress] = useState('')
  const [emailInvalid, setEmailInvalid] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const { account } = useWallet()
  const theme = useTheme()
  const [insideModal] = useInside('NotificationsModal')

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

  const handleOnSubscribeToNotifications = useCallback(() => {
    onSubscribeToNotifications(emailAddress)
  }, [emailAddress, onSubscribeToNotifications])

  return (
    <>
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
            {existingEmail
              ? `Update "${existingEmail}"`
              : 'Stay up to date with email notifications'}
          </span>

          <TextContent update={existingEmail} account={account} theme={theme} />

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
                  margin-bottom: 0px;
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
                    ) : emailAddress.trim() ? (
                      <IconCheck
                        css={`
                          color: ${theme.positive};
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
          setTermsAccepted={setTermsAccepted}
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
            <ActionButtons compactMode={compactMode} onClick={onOptOut}>
              Opt out
            </ActionButtons>
            <ActionButtons
              compactMode={compactMode}
              mode="strong"
              disabled={emailInvalid || !termsAccepted}
              onClick={handleOnSubscribeToNotifications}
            >
              Subscribe
            </ActionButtons>
          </div>
        )}
      </div>
    </>
  )
}

function TextContent({ update, account, theme }) {
  const content = update
    ? `Enter a new email address for your account ${account}. We will continue sending email notifications to the current email address until you verify this new email address.`
    : `Associate an email address to your account ${account}, so you can get notifications from all Aragon Court events.`

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
            <IdentityBadge
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

function LegalTermsAndPolicy({ termsAccepted, setTermsAccepted }) {
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
        <Checkbox
          checked={termsAccepted}
          onChange={checked => setTermsAccepted(checked)}
        />

        <span
          css={`
            ${textStyle('body2')};
            color: #9096b6;
            margin-left: ${1.5 * GU}px;
            text-align: left;
          `}
        >
          By continuing with your email, you agree to Aragon Court{' '}
          <Link href="https://anj.aragon.org/legal/terms-general.pdf">
            legal terms{' '}
          </Link>{' '}
          and{' '}
          <Link href="https://aragon.one/email-collection.md">
            {' '}
            email collection policy.
          </Link>
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

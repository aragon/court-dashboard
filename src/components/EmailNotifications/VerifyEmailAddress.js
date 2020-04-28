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
import { validateEmail } from '../../utils/notifications-utils'
import emailIllustration from '../../assets/emailIllustration.svg'

const VerifyEmailAddress = React.memo(function VerifyEmailAddress({
  updateMode,
  compactMode,
  email,
  onSubscribe,
  onSubscribeSuccess,
  onReSendVerificationEmail,
  onDeleteEmail,
  onError,
}) {
  const theme = useTheme()
  const [emailAddress, setEmailAddress] = useState('')
  const [emailInvalid, setEmailInvalid] = useState(null)
  const [termsAccepted, setTermsAccepted] = useState(false)

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

  const handleSubscribe = useCallback(async () => {
    const { subscribedEmail, error } = await onSubscribe(emailAddress)

    if (error) {
      onError()
    }
    onSubscribeSuccess(subscribedEmail)
  }, [emailAddress, onError, onSubscribe, onSubscribeSuccess])

  const handleReSendEmail = useCallback(async () => {
    const { error } = await onReSendVerificationEmail()

    if (error) {
      onError()
    }
  }, [onError, onReSendVerificationEmail])

  return (
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
          <img src={emailIllustration} width={141} height={141} alt="" />
        </div>
        <span
          css={`
            ${textStyle('title2')};
            margin-top: ${4 * GU}px;
          `}
        >
          Verify your email address
        </span>

        <span
          css={`
            ${textStyle('body2')};
            color: ${theme.surfaceContentSecondary};
            margin-top: ${1.5 * GU}px;
          `}
        >
          Almost there! We’ve sent a verification email to {email}. Kindly check
          your inbox and click the link to verify your account.
          {updateMode
            ? 'Alternatively, you can update this email or delete it, if you wish to unsubscribe'
            : ''}
        </span>
        {(() => {
          if (updateMode) {
            const buttonWidth = compactMode
              ? '100% '
              : `calc((100% - ${2 * GU}px) /  2)`
            return (
              <>
                <div
                  css={`
                    margin-top: ${5 * GU}px;
                  `}
                >
                  <Field label="Update email address">
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
                    )}
                  </Field>
                </div>
                <LegalTermsAndPolicy
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
                  <ActionButtons
                    compactMode={compactMode}
                    onClick={onDeleteEmail}
                    width={buttonWidth}
                  >
                    Delete email
                  </ActionButtons>
                  <ActionButtons
                    compactMode={compactMode}
                    mode="strong"
                    disabled={emailInvalid || !termsAccepted}
                    onClick={handleSubscribe}
                    width={buttonWidth}
                  >
                    Send verification email
                  </ActionButtons>
                </div>
              </>
            )
          }
          return (
            <Button
              css={`
                margin-top: ${3 * GU}px;
              `}
              mode="strong"
              onClick={handleReSendEmail}
            >
              Resend verification email
            </Button>
          )
        })()}
      </div>
    </div>
  )
})

function LegalTermsAndPolicy({ termsAccepted, setTermsAccepted, theme }) {
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

        {/** TODO- Add Links once we have them */}
        <span
          css={`
            ${textStyle('body2')};
            color: ${theme.surfaceContentSecondary};
            margin-left: ${1.5 * GU}px;
            text-align: left;
          `}
        >
          By continuing with your email, you agree to Aragon court{' '}
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

export default VerifyEmailAddress

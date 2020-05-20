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
} from '@aragon/ui'
import { validateEmail } from '../../utils/validate-utils'
import emailIllustration from '../../assets/emailIllustration.svg'

const VerifyEmailAddress = React.memo(function VerifyEmailAddress({
  updateMode,
  compactMode,
  email,
  onSubscribe,
  onResendEmail,
  onDeleteEmail,
}) {
  const theme = useTheme()
  const [emailAddress, setEmailAddress] = useState('')
  const [emailInvalid, setEmailInvalid] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)

  const [insideModal] = useInside('NotificationsModal')

  const handleEmailAddressBlur = useCallback(e => {
    const email = e.target.value
    const emailInvalid = !validateEmail(email)
    setEmailInvalid(emailInvalid)
    if (emailInvalid) {
      setErrorMessage('Please enter a valid email address.')
    }
  }, [])

  const handleEmailAddressChange = useCallback(e => {
    const email = e.target.value
    setEmailAddress(email)
    if (validateEmail(email)) {
      // Set only as valid while user typing. Use blur to set invalid
      setEmailInvalid(false)
    }
  }, [])

  const handleOnTermsChange = useCallback(
    checked => {
      setTermsAccepted(checked)
    },
    [setTermsAccepted]
  )

  const handleOnSubscribe = useCallback(() => {
    if (emailAddress === email) {
      setEmailInvalid(true)
      setErrorMessage('Email already exists.')
      return
    }
    onSubscribe(emailAddress)
  }, [emailAddress, onSubscribe, email])

  return (
    <div
      css={`
        padding-top: ${(insideModal ? 3 : 0) * GU}px;
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
        `}
      >
        Almost there! We’ve sent a verification email to{' '}
        <strong>{email}</strong>. Kindly check your inbox and click the link to
        verify your account.
        {updateMode &&
          'Alternatively, you can update this email or delete it, if you wish to unsubscribe'}
      </span>
      {(() => {
        if (!updateMode) {
          return (
            <Button
              mode="strong"
              onClick={onResendEmail}
              css={`
                margin-top: ${3 * GU}px;
              `}
            >
              Resend verification email
            </Button>
          )
        }
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
                  placeholder="you@example.org"
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
                    {errorMessage}
                  </p>
                )}
              </Field>
            </div>
            <LegalTermsAndPolicy
              termsAccepted={termsAccepted}
              onChange={handleOnTermsChange}
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
              <ActionButton compactMode={compactMode} onClick={onDeleteEmail}>
                Delete email
              </ActionButton>
              <ActionButton
                compactMode={compactMode}
                mode="strong"
                disabled={emailInvalid || !termsAccepted}
                onClick={handleOnSubscribe}
              >
                Send verification email
              </ActionButton>
            </div>
          </>
        )
      })()}
    </div>
  )
})

function LegalTermsAndPolicy({ termsAccepted, onChange }) {
  const theme = useTheme()

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
            color: ${theme.surfaceContentSecondary};
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
}

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

export default VerifyEmailAddress

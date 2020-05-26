import React, { useEffect, useState } from 'react'
import {
  Field,
  GU,
  IconCheck,
  IconCross,
  TextInput,
  textStyle,
  useInside,
  useTheme,
} from '@aragon/ui'

const EmailInput = React.memo(function EmailInput({
  existingEmail,
  status,
  ...inputProps
}) {
  const theme = useTheme()
  const [error, setError] = useState('')
  const [insideModal] = useInside('NotificationsModal')

  useEffect(() => {
    if (status === 'invalid') {
      return setError('Please enter a valid email address.')
    }
    return setError('')
  }, [status])

  const adornment = (() => {
    if (status === 'invalid')
      return (
        <IconCross
          css={`
            color: ${theme.negative};
          `}
        />
      )

    if (status === 'empty')
      return (
        <IconCheck
          css={`
            opacity: 0;
            color: ${theme.positive};
          `}
        />
      )

    return (
      <IconCheck
        css={`
          opacity: 1;
          color: ${theme.positive};
        `}
      />
    ) // status === 'valid'
  })()
  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        width: 100%;
      `}
    >
      <Field
        label={
          existingEmail
            ? insideModal
              ? 'Update email address'
              : 'Enter new email address'
            : 'Enter email address'
        }
        css={`
          width: 100%;
          margin-bottom: 0;
        `}
      >
        <TextInput
          adornment={adornment}
          adornmentPosition="end"
          type="email"
          wide
          placeholder="you@example.org"
          {...inputProps}
        />
      </Field>
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
  )
})

export default EmailInput

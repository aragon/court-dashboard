import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, GU, textStyle, useTheme } from '@aragon/ui'
import { useWallet } from '../providers/Wallet'
import { signMessage } from '../lib/web3-utils'
import { dayjs } from '../utils/date-utils'

import signRequestSuccessIllustration from '../../src/assets/signRequestSuccess.svg'
import signRequestFailIllustration from '../../src/assets/signRequestFail.svg'
import signRequestLoading from '../../src/assets/signRequestLoading.gif'

const SignerRequest = React.memo(function SignerRequest({
  compactMode,
  mode,
  onSignSuccess,
  text,
  title,
}) {
  const [signingError, setSigningError] = useState(false)

  const successMode = mode === 'success'

  const wallet = useWallet()

  const theme = useTheme()

  const illustration = useMemo(() => {
    if (signingError) {
      return signRequestFailIllustration
    }
    if (successMode) {
      return signRequestSuccessIllustration
    }
    return signRequestLoading
  }, [signingError, successMode])

  const { statusText, statusTextColor } = useMemo(() => {
    if (signingError) {
      return {
        statusText: 'Signature failed',
        statusTextColor: theme.negative,
      }
    }
    if (successMode) {
      return {
        statusText: 'Signature confirmed',
        statusTextColor: theme.positive,
      }
    }
    return {
      statusText: 'Waiting for signature…',
      statusTextColor: theme.surfaceContentSecondary,
    }
  }, [signingError, successMode, theme])

  const infoText = useMemo(() => {
    if (signingError) {
      return 'A error occurred when signing the message.'
    }
    return text
  }, [signingError, text])

  const requestSignature = useCallback(async () => {
    if (!wallet) {
      return
    }
    const now = dayjs.utc().toString()
    const { signHash, error } = await signMessage(wallet, now)

    if (error) {
      setSigningError(true)
      return
    }

    onSignSuccess(signHash, now)
  }, [onSignSuccess, wallet])

  /**  We only need to execute it when the component is rendered but if we need to retry the action we
   should call to the requestSignature callback */
  useEffect(() => {
    if (successMode) {
      return
    }
    requestSignature()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div
        css={`
          display: flex;
          flex-direction: column;
          text-align: center;
          align-items: center;
        `}
      >
        <img src={illustration} height={140} width={140} />
        <h3
          css={`
            ${textStyle('title2')};
            margin-top: ${4 * GU}px;
          `}
        >
          {title}
        </h3>

        <span
          css={`
            ${textStyle('body2')};
            color: ${statusTextColor};
            margin-top: ${1.5 * GU}px;
          `}
        >
          {statusText}
        </span>
        <span
          css={`
            ${textStyle('body2')};
            color: ${theme.surfaceContentSecondary};
            margin-top: ${1.5 * GU}px;
          `}
        >
          {infoText}
        </span>
        {signingError && (
          <div
            css={`
              display: flex;
              justify-content: space-between;
              width: 100%;
              flex-direction: ${compactMode ? 'column' : 'row'};
              margin-top: ${3 * GU}px;
            `}
          >
            {/* TODO - Update the link once https://github.com/aragon/help/issues/31 is resolved */}
            <ActionButton
              href="https://help.aragon.org/article/27-general-troubleshooting-tips"
              compactMode={compactMode}
            >
              Troubleshooting
            </ActionButton>
            <ActionButton
              mode="strong"
              onClick={requestSignature}
              compactMode={compactMode}
            >
              Repeat signature
            </ActionButton>
          </div>
        )}
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

export default SignerRequest

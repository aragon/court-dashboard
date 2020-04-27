import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, GU, textStyle, useTheme } from '@aragon/ui'
import { useWallet } from '../providers/Wallet'
import { signMessage } from '../lib/web3-utils'
import { dayjs } from '../utils/date-utils'
import signRequestIllustration from '../../src/assets/signRequest.svg'
import signRequestSuccessIllustration from '../../src/assets/signRequestSuccess.svg'
import signRequestFailIllustration from '../../src/assets/signRequestFail.svg'

const SignerRequest = React.memo(function SignerRequest({
  actionText,
  compactMode,
  onActionErrorScreen,
  onActionSuccessScreen,
  onSignSuccessAction,
  successText,
  title,
}) {
  const [signingError, setSigningError] = useState(false)
  const [signHash, setSignHash] = useState('')

  const wallet = useWallet()
  const theme = useTheme()

  const illustration = getIllustration(signingError, signHash)
  const { statusText, statusTextColor } = getStatusText(
    signingError,
    signHash,
    theme
  )
  const infoText = getInfoText(signingError, signHash, successText, actionText)

  const buttonWidth = compactMode ? '100% ' : `calc((100% - ${2 * GU}px) /  2)`

  useEffect(() => {
    const requestSignature = async () => {
      if (!wallet || signingError) {
        return
      }
      const now = dayjs().toString()
      const { signHash, error } = await signMessage(wallet, now)

      if (error) {
        setSigningError(true)
        return
      }
      const { error: actionError } = await onSignSuccessAction()

      if (actionError) {
        onActionErrorScreen()
      }

      setSignHash(signHash)

      if (onActionSuccessScreen) {
        const timer = setTimeout(() => {
          onActionSuccessScreen()
        }, 3000)
        return () => clearTimeout(timer)
      }
    }
    requestSignature()

    /* We only need to execute it at the beginning but in order to be able to execute it again
     if the repeat signature button is clicked we need the signingError as a dependency */
  }, [signingError]) // eslint-disable-line react-hooks/exhaustive-deps

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
        <img src={illustration} />
        <span
          css={`
            ${textStyle('title2')};
            margin-top: ${4 * GU}px;
          `}
        >
          {title}
        </span>

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
              margin-bottom: ${1.5 * GU}px;
              margin-top: ${3 * GU}px;
            `}
          >
            <ActionButtons onClick={() => {}} width={buttonWidth}>
              Troubleshooting
            </ActionButtons>
            <ActionButtons
              mode="strong"
              onClick={() => {
                setSigningError(false)
              }}
              width={buttonWidth}
            >
              Repeat signature
            </ActionButtons>
          </div>
        )}
      </div>
    </div>
  )
})

function getIllustration(error, signHash) {
  if (error) {
    return signRequestFailIllustration
  }
  if (signHash) {
    return signRequestSuccessIllustration
  }
  return signRequestIllustration
}

function getStatusText(error, signHash, theme) {
  if (error) {
    return { statusText: 'Signature failed', statusTextColor: '#FF6969' }
  }
  if (signHash) {
    return { statusText: 'Signature confirmed', statusTextColor: '#2CC68F' }
  }
  return {
    statusText: 'Waiting for signature…',
    statusTextColor: theme.surfaceContentSecondary,
  }
}

function getInfoText(error, signHash, successText, actionText) {
  if (error) {
    return 'An error has occurred when signing the message.'
  }
  if (signHash) {
    return successText
  }
  return `Open your Ethereum provider (Metamask or similar) to complete the
  signature request. Signing this message will prove ownership of your
  account and ${actionText}`
}

const ActionButtons = styled(Button)`
  width: ${({ width }) => width};
`
export default SignerRequest

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, GU, textStyle, useTheme } from '@aragon/ui'
import { useWallet } from '../providers/Wallet'
import { getProviderFromUseWalletId } from '../ethereum-providers'
import { signMessage } from '../lib/web3-utils'
import { dayjs } from '../utils/date-utils'

import signRequestSuccessIllustration from '../../src/assets/signRequestSuccess.svg'
import signRequestFailIllustration from '../../src/assets/signRequestFail.svg'
import signProcessing from '../../src/assets/loader.gif'

const SignerRequest = React.memo(function SignerRequest({
  actionText,
  compactMode,
  onActionSuccess,
  onSignSuccess,
  successText,
  title,
}) {
  const [signingError, setSigningError] = useState(false)
  const [signHash, setSignHash] = useState('')

  const wallet = useWallet()

  const provider = getProviderFromUseWalletId(wallet.activated)

  const theme = useTheme()

  const illustration = useMemo(() => {
    if (signingError) {
      return signRequestFailIllustration
    }
    if (signHash) {
      return signRequestSuccessIllustration
    }
    return signProcessing
  }, [signingError, signHash])

  const { statusText, statusTextColor } = useMemo(() => {
    if (signingError) {
      return { statusText: 'Signature failed', statusTextColor: theme.negative }
    }
    if (signHash) {
      return {
        statusText: 'Signature confirmed',
        statusTextColor: theme.positive,
      }
    }
    return {
      statusText: 'Waiting for signature…',
      statusTextColor: theme.surfaceContentSecondary,
    }
  }, [signingError, signHash, theme])

  const infoText = useMemo(() => {
    if (signingError) {
      return 'An error has occurred when signing the message.'
    }
    if (signHash) {
      return successText
    }
    return `Open ${provider.name} to complete the
    signature request. Signing this message will prove ownership of your
    account and ${actionText}`
  }, [actionText, provider, signingError, signHash, successText])

  const requestSignature = useCallback(async () => {
    if (!wallet) {
      return
    }
    const now = dayjs().toString()
    const { signHash, error } = await signMessage(wallet, now)

    if (error) {
      setSigningError(true)
      return
    }

    if (typeof onSignSuccess === 'function') {
      await onSignSuccess(signHash, now)

      setSignHash(signHash)
    }
  }, [onSignSuccess, wallet])

  useEffect(() => {
    requestSignature()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!signHash) {
      return
    }

    if (typeof onActionSuccess === 'function') {
      const timer = setTimeout(() => {
        onActionSuccess()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [signHash, onActionSuccess])

  return (
    <div
      css={`
        padding: ${3 * GU}px;
      `}
    >
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
              margin-bottom: ${1.5 * GU}px;
              margin-top: ${3 * GU}px;
            `}
          >
            {/* TODO- Add the link once we have it */}
            <ActionButtons onClick={() => {}} compactMode={compactMode}>
              Troubleshooting
            </ActionButtons>
            <ActionButtons
              mode="strong"
              onClick={requestSignature}
              compactMode={compactMode}
            >
              Repeat signature
            </ActionButtons>
          </div>
        )}
      </div>
    </div>
  )
})

const ActionButtons = styled(Button)`
  width: ${({ compactMode }) =>
    compactMode ? '100% ' : `calc((100% - ${2 * GU}px) /  2)`};
`
export default SignerRequest

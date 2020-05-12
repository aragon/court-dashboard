import React from 'react'
import styled from 'styled-components'
import { Button, GU, Link, textStyle, useTheme } from '@aragon/ui'
import IdentityBadge from '../IdentityBadge'
import { addressesEqual, transformAddresses } from '../../lib/web3-utils'

import emailNotifcationIllustration from '../../../src/assets/emailNotifications.svg'

function ExistingEmailSubscription({
  account,
  compactMode,
  onOptOut,
  onSubscribeToNotifications,
}) {
  const theme = useTheme()

  const textContent = `We’ve detected an email associated to the account ${account}.
  First, we need to verify that you are in control of this account and then, authenticate
  the email address you provided.`

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
          <h3
            css={`
              ${textStyle('title2')};
              margin-top: ${4 * GU}px;
            `}
          >
            Stay up to date with email notifications
          </h3>

          <span
            css={`
              ${textStyle('body2')};
              color: ${theme.surfaceContentSecondary};
              margin-top: ${1.5 * GU}px;
            `}
          >
            {transformAddresses(textContent, (part, isAddress, index) =>
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
        </div>
        <span
          css={`
            ${textStyle('body2')};
            color: #9096b6;
            text-align: center;
            margin-top: ${3 * GU}px;
          `}
        >
          You have previously agreed to Aragon Court{' '}
          <Link href="https://anj.aragon.org/legal/terms-general.pdf">
            legal terms{' '}
          </Link>{' '}
          and{' '}
          <Link href="https://aragon.one/email-collection.md">
            {' '}
            email collection policy.
          </Link>
        </span>
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
            onClick={onSubscribeToNotifications}
          >
            Subscribe to notifications
          </ActionButtons>
        </div>
      </div>
    </>
  )
}

const ActionButtons = styled(Button)`
  width: ${({ compactMode }) =>
    compactMode ? '100% ' : `calc((100% - ${2 * GU}px) /  2)`};
`

export default ExistingEmailSubscription

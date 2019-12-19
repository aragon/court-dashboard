import React from 'react'
import { EthIdenticon, GU, useTheme, textStyle } from '@aragon/ui'
import { shortenAddress } from '../../web3-utils'
import {
  ACCOUNT_STATUS_ACTIVE,
  ACCOUNT_STATUS_INACTIVE,
} from '../../dispute-status-type'

const getProfileAttributes = (status, theme) => {
  if (status === ACCOUNT_STATUS_ACTIVE)
    return {
      background: 'linear-gradient(35deg, #ff8888 -75%, #ffb36d 105%)', // TODO: replace for  theme.accentEnd and   theme.accentStart
      primaryColor: theme.accentContent, // TODO: replace for theme.accentContent
      secondaryColor: theme.accentContent, // TODO: replace for theme.accentContent
      statusLabel: 'ACTIVE JUROR',
      icon: null,
    }

  if (status === ACCOUNT_STATUS_INACTIVE)
    return {
      background: 'linear-gradient(208deg, #FFFAF1 -3%, #FFEBEB 216%)',
      primaryColor: theme.content,
      secondaryColor: theme.contentSecondary,
      statusLabel: 'INACTIVE JUROR',
      icon: null,
    }

  return {
    background: '#F0F2F7',
    primaryColor: theme.content,
    secondaryColor: theme.contentSecondary,
    statusLabel: 'ACCOUNT',
  }
}

export default function ProfileHeader({ account, status }) {
  const theme = useTheme()
  const {
    background,
    primaryColor,
    secondaryColor,
    statusLabel,
    icon,
  } = getProfileAttributes(status, theme)

  return (
    <div
      css={`
        background: ${background};
        padding: ${3 * GU}px;
        display: flex;
        align-items: stretch;
      `}
    >
      <EthIdenticon
        address={account}
        radius={100}
        scale={2}
        css={`
          margin-right: ${1.5 * GU}px;
        `}
      />
      <div
        css={`
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        `}
      >
        <span
          css={`
            ${textStyle('body1')}
            color: ${primaryColor};
          `}
        >
          {shortenAddress(account)}
        </span>
        <span
          css={`
            ${textStyle('label2')}
            display: block;
            color: ${secondaryColor};
          `}
        >
          {icon && <img src={icon} alt="juror-icon" />}
          {statusLabel}
        </span>
      </div>
    </div>
  )
}

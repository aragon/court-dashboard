import React from 'react'
import { GU, textStyle, useTheme } from '@aragon/ui'

import anjSpringIcon from '../../assets/anj-spring.svg'
import userIcon from '../../assets/user.svg'
import gavelIcon from '../../assets/gavel.svg'

import {
  ACCOUNT_STATUS_JUROR_ACTIVE,
  // ACCOUNT_STATUS_INACTIVE,
} from '../../types/account-status-types'
import { formatTokenAmount } from '../../lib/math-utils'
import { useCourtConfig } from '../../providers/CourtConfig'

const getInformationAttributes = (
  status,
  drafted,
  minActiveBalance,
  decimals,
  theme
) => {
  // TODO: Finish all possible states
  if (status === ACCOUNT_STATUS_JUROR_ACTIVE) {
    if (!drafted) {
      return {
        icon: userIcon,
        iconBackground: 'rgb(38,195,149, 0.2)', // TODO: use theme
        title: 'You are elegible to be drafted',
        titleColor: 'rgb(38,195,149)',
        paragraph: 'You are eligible to be drafted starting from the next term',
      }
    }

    if (drafted) {
      return {
        icon: gavelIcon,
        iconBackground: 'rgb(38,195,149, 0.2)', // TODO: use theme
        title: 'You have been drafted',
        titleColor: 'rgb(38,195,149)',
        paragraph:
          'You can start reviewing the evidence and then commit your vote',
      }
    }
  }

  return {
    icon: anjSpringIcon,
    title: 'Active ANJ to be an active juror',
    paragraph: `You must activate at least ${formatTokenAmount(
      minActiveBalance,
      false,
      decimals
    )}  ANJ to be drafted as a juror`,
  }
}

function AccountBanner({ status, minActiveBalance, drafted }) {
  const theme = useTheme()
  const { anjToken } = useCourtConfig()
  const {
    icon,
    title,
    titleColor,
    paragraph,
    iconBackground,
  } = getInformationAttributes(
    status,
    drafted,
    minActiveBalance,
    anjToken.decimals,
    theme
  )

  const iconBackgroundStyle = iconBackground
    ? `   
      background: ${iconBackground};
      height: ${6 * GU}px;
      padding: ${1.5 * GU}px;
      border-radius: 50%;`
    : ''

  return (
    <div
      css={`
        display: flex;
      `}
    >
      <div
        css={`
          margin-right: ${1.5 * GU}px;
        `}
      >
        <div css={iconBackgroundStyle}>
          <img
            css={`
              display: block;
            `}
            height={iconBackground ? 3 * GU : 6 * GU}
            src={icon}
            alt="info-icon"
          />
        </div>
      </div>
      <div
        css={`
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          height: ${6 * GU}px;
        `}
      >
        <span
          css={`
            ${textStyle('title4')}
            color: ${titleColor};
          `}
        >
          {title}
        </span>
        <span
          css={`
            color: ${theme.contentSecondary};
            display: block;
          `}
        >
          {paragraph}
        </span>
      </div>
    </div>
  )
}

export default AccountBanner

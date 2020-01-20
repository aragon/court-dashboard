import React from 'react'
import { CircleGraph, GU, Help, useTheme } from '@aragon/ui'

import { useCourtConfig } from '../../providers/CourtConfig'
import { useTotalActiveBalancePolling } from '../../hooks/useCourt'
import { useClock } from '../../providers/Clock'

import AccountBannerInfo from './AccountBannerInfo'

import { ACCOUNT_STATUS_JUROR_ACTIVE } from '../../types/account-status-types'
import { formatUnits, getPercentage } from '../../lib/math-utils'

import anjSpringIcon from '../../assets/anj-spring.svg'
import userIcon from '../../assets/user.svg'
import gavelIcon from '../../assets/gavel.svg'
import { getProbabilityText } from '../../utils/account-utils'
import { useJurorFirstTimeANJActivation } from '../../hooks/useANJ'

const getBannerAttributes = (
  status,
  drafted,
  isFirstTimeActivating,
  minActiveBalance,
  decimals,
  theme
) => {
  if (status === ACCOUNT_STATUS_JUROR_ACTIVE) {
    // NOTE: This one could not be included in the final version
    if (drafted) {
      return {
        icon: gavelIcon,
        iconBackground: theme.positive.alpha(0.2),
        title: 'You have been drafted',
        titleColor: theme.positive,
        paragraph:
          'You can start reviewing the evidence and then commit your vote',
      }
    }

    if (isFirstTimeActivating) {
      return {
        icon: userIcon,
        iconBackground: theme.positive.alpha(0.2),
        title: 'You are elegible to be drafted',
        titleColor: theme.positive,
        paragraph: 'You are eligible to be drafted starting from the next term',
        showTimer: true,
      }
    }

    return { showProbability: true }
  }

  return {
    icon: anjSpringIcon,
    title: 'Active ANJ to be an active juror',
    paragraph: `You must activate at least ${formatUnits(minActiveBalance, {
      digits: decimals,
    })}  ANJ to be drafted as a juror`,
  }
}

function AccountBanner({ status, minActiveBalance, activeBalance, drafted }) {
  const theme = useTheme()
  const { anjToken } = useCourtConfig()

  const isFirstTimeActivating = useJurorFirstTimeANJActivation({
    pause: drafted || status !== ACCOUNT_STATUS_JUROR_ACTIVE,
  })

  const attributes = getBannerAttributes(
    status,
    drafted,
    isFirstTimeActivating,
    minActiveBalance,
    anjToken.decimals,
    theme
  )

  if (attributes.showProbability)
    return <BannerWithProbability activeBalance={activeBalance} />

  const {
    icon,
    title,
    titleColor,
    paragraph,
    iconBackground,
    showTimer,
  } = attributes

  const iconBackgroundStyle = iconBackground
    ? `   
    background: ${iconBackground};
    height: ${6 * GU}px;
    padding: ${1.5 * GU}px;
    border-radius: 50%;`
    : ''

  return (
    <Wrapper
      mainIcon={
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
      }
      information={
        <AccountBannerInfo
          title={title}
          titleColor={titleColor}
          paragraph={paragraph}
          showTimer={showTimer}
        />
      }
    />
  )
}

const Wrapper = ({ mainIcon, information }) => {
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
        {mainIcon}
      </div>
      {information}
    </div>
  )
}

const BannerWithProbability = ({ activeBalance }) => {
  const theme = useTheme()
  const { currentTermId } = useClock()

  // Calculate juror's active balance and total active balance for current term
  const {
    amount: activeAmount,
    amountNotEffective: activeAmountNotEffective,
  } = activeBalance
  const activeBalanceCurrentTerm = activeAmount.sub(activeAmountNotEffective)
  const totalActiveBalanceCurrentTerm = useTotalActiveBalancePolling(
    currentTermId
  )

  const totalPercentage = getPercentage(
    activeBalanceCurrentTerm,
    totalActiveBalanceCurrentTerm
  )

  // Calculate probability (since the total active balance is asynconous
  // it can happen that it has not been updated yet when the juror active balance has)
  const draftingProbability = Math.min(1, totalPercentage / 100)
  const probabilityText = getProbabilityText(draftingProbability)

  const title = (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <span css="margin-right: 8px">
        <span
          css={`
            color: ${theme.accent};
          `}
        >
          {probabilityText} probability{' '}
        </span>
        to be drafted
      </span>
      <Help hint="How is the probability calculated?">
        Probability of being drafted depends on the total ANJ you have activated
        and the total ANJ activated for a given term
      </Help>
    </div>
  )

  const paragraph =
    'The more ANJ you activate, more chances you have to be drafted to arbitrate a dispute'

  return (
    <Wrapper
      mainIcon={<CircleGraph value={draftingProbability} size={6 * GU} />}
      information={<AccountBannerInfo title={title} paragraph={paragraph} />}
    />
  )
}

export default AccountBanner

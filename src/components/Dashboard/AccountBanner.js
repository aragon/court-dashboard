import React from 'react'
import { CircleGraph, GU, Help, useTheme } from '@aragon/ui'

import AccountBannerInfo from './AccountBannerInfo'

import { useCourtConfig } from '../../providers/CourtConfig'
import { useTotalActiveBalancePolling } from '../../hooks/useCourtContracts'
import { useJurorFirstTimeANJActivation } from '../../hooks/useANJ'
import { useCourtClock } from '../../providers/CourtClock'

import { ACCOUNT_STATUS_JUROR_ACTIVE } from '../../types/account-status-types'
import { formatUnits, getPercentageBN } from '../../lib/math-utils'

import anjSpringIcon from '../../assets/IconANJSpring.svg'
import userIcon from '../../assets/IconUser.svg'
import gavelIcon from '../../assets/IconGavel.svg'
import { useJurorDrafted } from '../../hooks/useJurorDraft'
import Loading from './Loading'

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
        title: 'You are eligible to be drafted',
        titleColor: theme.positive,
        paragraph: 'You are eligible to be drafted starting from the next term',
        showTimer: true,
      }
    }

    return { showProbability: true }
  }

  return {
    icon: anjSpringIcon,
    title: 'Activate ANJ to be an active juror',
    paragraph: `You must activate at least ${formatUnits(minActiveBalance, {
      digits: decimals,
    })}  ANJ to be drafted as a juror`,
  }
}

function AccountBanner({ status, loading, minActiveBalance, activeBalance }) {
  const theme = useTheme()
  const { anjToken } = useCourtConfig()

  // check if juror has been drafted in this current term
  const isJurorDrafted = useJurorDrafted({
    pause: status !== ACCOUNT_STATUS_JUROR_ACTIVE,
  })

  // check if it's the first time activating ANJ
  const isFirstTimeActivating = useJurorFirstTimeANJActivation({
    pause: isJurorDrafted || status !== ACCOUNT_STATUS_JUROR_ACTIVE,
  })

  const attributes = getBannerAttributes(
    status,
    isJurorDrafted,
    isFirstTimeActivating,
    minActiveBalance,
    anjToken.decimals,
    theme
  )

  if (loading) return <Loading height={48} />

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

  return (
    <Wrapper
      mainIcon={
        <div
          css={`
            display: flex;
            align-items: center;
            background: ${iconBackground};
            height: ${6 * GU}px;
            width: ${iconBackground ? 6 * GU + 'px' : 'auto'};
            border-radius: 50%;
          `}
        >
          <img
            css={`
              display: block;
              margin: 0 auto;
            `}
            height={iconBackground ? 3 * GU : 6 * GU}
            src={icon}
            alt=""
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
  const { currentTermId } = useCourtClock()

  // Calculate juror's active balance and total active balance for current term
  const {
    amount: activeAmount,
    amountNotEffective: activeAmountNotEffective,
  } = activeBalance
  const activeBalanceCurrentTerm = activeAmount.sub(activeAmountNotEffective)
  const totalActiveBalanceCurrentTerm = useTotalActiveBalancePolling(
    currentTermId
  )
  const totalPercentage = getPercentageBN(
    activeBalanceCurrentTerm,
    totalActiveBalanceCurrentTerm
  )

  // Calculate probability (since the total active balance is asynconous
  // it can happen that it has not been updated yet when the juror active balance has)
  const draftingProbability = Math.min(1, totalPercentage / 100)
  const chances = totalPercentage > 0 ? Math.floor(100 / totalPercentage) : 0

  const title = (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <span css="margin-right: 8px">
        You'll be drafted, on average
        <span
          css={`
            color: ${theme.accent};
          `}
        >
          {` 1 on every ${chances} times `}
        </span>
        during this term
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

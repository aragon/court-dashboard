import React from 'react'
import { animated, useSpring } from 'react-spring'
import { GU, Help, LoadingRing, useTheme } from '@aragon/ui'

import AccountBannerInfo from './AccountBannerInfo'
import CircleGraph from '../CircleGraph'
import { useCourtConfig } from '../../providers/CourtConfig'
import { useTotalActiveBalance } from '../../hooks/useCourtStats'
import { useJurorFirstTimeANJActivation } from '../../hooks/useANJ'

import { ACCOUNT_STATUS_JUROR_ACTIVE } from '../../types/account-status-types'
import { getPercentageBN, bigNum } from '../../lib/math-utils'

import anjSpringIcon from '../../assets/IconANJSpring.svg'
import { useJurorDrafted } from '../../hooks/useJurorDrafted'

const getBannerAttributes = () => {
  return {
    icon: anjSpringIcon,
    title: 'Deprecation warning: ANJ Withdraws',
    paragraph: `This version of Aragon Court is deprecated. Please deactivate your ANJ and convert it to ANT so as to use the new Aragon Court. When deactivating it, make sure you wait until the term ends to be able to withdraw it. Keep in mind that terms need to be updated manually.`,
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

  if (loading) {
    return <BannerLoadingRing />
  }
  if (attributes.showProbability) {
    return <BannerWithProbability activeBalance={activeBalance} />
  }
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
            justify-content: center;
            background: ${iconBackground};
            width: ${iconBackground ? 7 * GU + 'px' : 'auto'};
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
  const springProps = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 200,
  })

  return (
    <animated.div
      style={springProps}
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
    </animated.div>
  )
}

const BannerWithProbability = ({ activeBalance }) => {
  const theme = useTheme()
  const [totalActiveBalanceCurrentTerm] = useTotalActiveBalance()

  const fetchingTotalBalance = totalActiveBalanceCurrentTerm.eq(bigNum(-1))
  if (fetchingTotalBalance) {
    return <BannerLoadingRing />
  }

  // Calculate juror's active balance and total active balance for current term
  const {
    amount: activeAmount,
    amountNotEffective: activeAmountNotEffective,
  } = activeBalance
  const activeBalanceCurrentTerm = activeAmount.sub(activeAmountNotEffective)
  const totalPercentage = getPercentageBN(
    activeBalanceCurrentTerm,
    totalActiveBalanceCurrentTerm
  )

  // Calculate probability (since the total active balance is asynchronous
  // it can happen that it has not been updated yet when the juror active balance has)
  const draftingProbability = Math.min(1, totalPercentage / 100)
  const probablilityTooLow = totalPercentage < 1

  const chances = probablilityTooLow
    ? '100+'
    : totalPercentage > 0 && Math.floor(100 / totalPercentage)

  const title = (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <span
        css={`
          margin-right: ${1 * GU}px;
        `}
      >
        {'On average, you will be drafted into a jury '}
        <span
          css={`
            color: ${theme.accent};
          `}
        >
          1 in {chances} times
        </span>
      </span>
      <Help hint="How is the probability calculated?">
        <p>
          This is a numerical estimate of your likelihood of being selected for
          arbitration. It’s calculated by dividing your active ANJ balance
          against the Court's total active ANJ balance during the current term.
        </p>
        <p
          css={`
            margin-top: ${1 * GU}px;
          `}
        >
          {probablilityTooLow
            ? `
                You currently have <1% of all activated ANJ, hence are unlikely
                to be drafted unless a dispute goes to the final round or many
                disputes are created. Activate more ANJ to increase your chances
                of being selected as a juror.
              `
            : `
                You can always activate more ANJ to increase your chances of
                being selected as a juror.
              `}
        </p>
      </Help>
    </div>
  )

  const paragraph =
    'The more ANJ you activate, the more likely you will be drafted to arbitrate a dispute'

  return (
    <Wrapper
      mainIcon={<CircleGraph value={draftingProbability} />}
      information={<AccountBannerInfo title={title} paragraph={paragraph} />}
    />
  )
}

function BannerLoadingRing() {
  return (
    <div
      css={`
        display: flex;
        align-items: center;
        height: ${7 * GU}px;
      `}
    >
      <LoadingRing />
    </div>
  )
}

export default AccountBanner

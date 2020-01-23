import React from 'react'
import { Distribution, GU, Tag, textStyle, useTheme } from '@aragon/ui'

import { OUTCOMES, isValidOutcome } from '../../utils/crvoting-utils'
import { getPercentage } from '../../lib/math-utils'
import { useConnectedAccount } from '../../providers/Web3'
import { getJurorDraft } from '../../utils/juror-draft-utils'

function DisputeCurrentRuling({ dispute }) {
  const theme = useTheme()
  const connectedAccount = useConnectedAccount()

  const { lastRoundId, rounds } = dispute
  const lastRound = rounds[lastRoundId]

  const jurorDraft = getJurorDraft(lastRound, connectedAccount)

  const { outcome: myOutcome = 0 } = jurorDraft || {}

  const [totalRefused, totalAgainst, totalInFavour] = useOutcomeDistribution(
    lastRound
  )

  const myDistributionIndex = getMyDistributionIndex(myOutcome)

  return (
    <div>
      <Distribution
        heading={
          <span
            css={`
              ${textStyle('label2')}
              color: ${theme.contentSecondary}
            `}
          >
            Current ruling
          </span>
        }
        items={[
          { item: 'Voted in favour', percentage: totalInFavour },
          { item: 'Voted against', percentage: totalAgainst },
          { item: 'Refused to vote', percentage: totalRefused },
        ]}
        renderFullLegendItem={({ color, item, index, percentage }) => (
          <div
            css={`
              display: flex;
              align-items: center;
            `}
          >
            <div
              css={`
                background: ${color};
                width: 8px;
                height: 8px;
                margin-right: 8px;
                border-radius: 50%;
              `}
            />

            <span
              key={index}
              css={`
                color: ${theme.contentSecondary};
                width: 120px;
              `}
            >
              {item}
            </span>
            <span
              css={`
                margin-right: ${1 * GU}px;
              `}
            >
              {percentage}%
            </span>
            {myDistributionIndex === index && <Tag>You</Tag>}
          </div>
        )}
        colors={[theme.positive, theme.negative, theme.hint]}
      />
    </div>
  )
}

const useTotalOutcomes = round => {
  const { jurors } = round

  const validOutcomes = jurors.filter(({ outcome }) => isValidOutcome(outcome))
  const refusedOutcomes = validOutcomes.filter(
    ({ outcome }) => outcome === OUTCOMES.REFUSED
  )
  const againstOutcomes = validOutcomes.filter(
    ({ outcome }) => outcome === OUTCOMES.AGAINST
  )
  const inFavourOutcomes = validOutcomes.filter(
    ({ outcome }) => outcome === OUTCOMES.IN_FAVOUR
  )

  return {
    totalValidOutcomes: validOutcomes.length,
    totalRefused: refusedOutcomes.length,
    totalAgainst: againstOutcomes.length,
    totalInFavour: inFavourOutcomes.length,
  }
}

function useOutcomeDistribution(round) {
  const {
    totalValidOutcomes,
    totalRefused,
    totalAgainst,
    totalInFavour,
  } = useTotalOutcomes(round)

  return [totalRefused, totalAgainst, totalInFavour].map(partial =>
    getPercentage(partial, totalValidOutcomes)
  )
}

function getMyDistributionIndex(outcome) {
  if (!isValidOutcome(outcome)) return -1

  if (outcome === OUTCOMES.IN_FAVOUR) return 0
  if (outcome === OUTCOMES.AGAINST) return 1

  return 2
}

export default DisputeCurrentRuling

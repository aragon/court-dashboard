import React, { useMemo } from 'react'
import { Distribution, GU, Tag, textStyle, useTheme } from '@aragon/ui'

import {
  isValidOutcome,
  getTotalOutcomeWeight,
  filterByValidOutcome,
  outcomeToString,
  getOutcomeColor,
} from '../../utils/crvoting-utils'
import { getPercentage } from '../../lib/math-utils'
import { useConnectedAccount } from '../../providers/Web3'
import { getJurorDraft } from '../../utils/juror-draft-utils'
import { getDisputeLastRound } from '../../utils/dispute-utils'

function DisputeCurrentRuling({ dispute }) {
  const theme = useTheme()
  const connectedAccount = useConnectedAccount()

  const lastRound = getDisputeLastRound(dispute)
  const jurorDraft = getJurorDraft(lastRound, connectedAccount)

  const { outcome: myOutcome = 0 } = jurorDraft || {}
  const distribution = useOutcomeDistribution(lastRound)

  // distribution is sorted by weight so we can return colors in corresponding order
  const colors = distribution.map(({ outcome }) =>
    getOutcomeColor(outcome, theme)
  )

  const myDistributionIndex = distribution.findIndex(
    ({ outcome }) => outcome === myOutcome
  )

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
        items={distribution.map(({ outcome, weight }) => ({
          item: outcomeToString(outcome),
          percentage: weight,
        }))}
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
        colors={colors}
      />
    </div>
  )
}

const useFilteredOutcomes = round => {
  const { jurors } = round

  return useMemo(() => {
    const totalValidOutcomes = jurors.filter(({ outcome }) =>
      isValidOutcome(outcome)
    )
    return [totalValidOutcomes, filterByValidOutcome(totalValidOutcomes)]
  }, [jurors])
}

function useOutcomeDistribution(round) {
  const [totalValidOutcomes, filteredOutcomes] = useFilteredOutcomes(round)

  return useMemo(() => {
    const totalWeight = getTotalOutcomeWeight(totalValidOutcomes)

    return filteredOutcomes
      .map(({ outcomes, outcome }) => {
        const partialWeight = getTotalOutcomeWeight(outcomes)
        return {
          outcome,
          weight: getPercentage(partialWeight, totalWeight),
        }
      })
      .sort((outcome1, outcome2) => outcome2.weight - outcome1.weight)
  }, [filteredOutcomes, totalValidOutcomes])
}

export default DisputeCurrentRuling

import React, { useMemo } from 'react'
import { Distribution, GU, Help, Tag, textStyle, useTheme } from '@aragon/ui'
import { useWallet } from '../../providers/Wallet'
import {
  isValidOutcome,
  getTotalOutcomeWeight,
  filterByValidOutcome,
  juryOutcomeToString,
  OUTCOMES,
} from '../../utils/crvoting-utils'
import { getPercentage } from '../../lib/math-utils'
import { getJurorDraft } from '../../utils/juror-draft-utils'
import { getDisputeLastRound } from '../../utils/dispute-utils'

const getOutcomeColor = (outcome, theme) => {
  if (outcome === OUTCOMES.InFavor) return theme.positive
  if (outcome === OUTCOMES.Against) return theme.negative

  return theme.hint
}

function DisputeCurrentRuling({ dispute }) {
  const theme = useTheme()
  const wallet = useWallet()

  const lastRound = getDisputeLastRound(dispute)
  const jurorDraft = getJurorDraft(lastRound, wallet.account)

  const { outcome: myOutcome = 0, weight: myWeight = 0 } = jurorDraft || {}
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
          item: juryOutcomeToString(outcome),
          percentage: weight,
        }))}
        renderFullLegendItem={({ color, item, index, percentage }) => {
          // We'll show the juror voting weight hint if any juror has been drafted more than once for this last round
          const showVotingWeightHint =
            index === 0 && lastRound.jurorsNumber !== lastRound.jurors.length
          const showMyWeight = myWeight > 1

          return (
            <div
              css={`
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
              `}
            >
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
                    margin-right: ${1 * GU}px;
                    border-radius: 50%;
                  `}
                />

                <span
                  key={index}
                  css={`
                    color: ${theme.contentSecondary};
                    width: 220px;
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
              {showVotingWeightHint && (
                <div
                  css={`
                    display: flex;
                    align-items: center;
                  `}
                >
                  <span
                    css={`
                      color: ${theme.help};
                      margin-right: ${0.5 * GU}px;
                    `}
                  >
                    {showMyWeight ? 'Your voting weight' : 'Voting weight'}
                  </span>
                  <Help hint="">
                    {showMyWeight ? 'You have been' : 'The same juror can be'}{' '}
                    drafted multiple times to arbitrate the same dispute for the
                    same round. When that happens,{' '}
                    {showMyWeight ? 'your' : 'their'} voting weight{' '}
                    {showMyWeight ? 'is' : 'will be'} proportional to the number
                    of times {showMyWeight ? 'you' : 'they'} are drafted.
                  </Help>
                </div>
              )}
            </div>
          )
        }}
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

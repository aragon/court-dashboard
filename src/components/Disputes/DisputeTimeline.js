import React from 'react'
import {
  Accordion,
  GU,
  textStyle,
  useTheme,
  // IconCoin,
  IconFolder,
  IconFlag,
  IconGroup,
  // IconSearch,
  IconVote,
  IconWrite,
} from '@aragon/ui'

// import { timeline } from '../../mock-data'
import Stepper from '../Stepper'
import Step from '../Step'
// import { getDisputeTimeLine } from '../../utils/disputeUtils'
// import { useCourtSettings } from '../../court-settings-manager'
// import { convertToString } from '../../types/types'
import * as DisputesTypes from '../../types/types'

function DisputeTimeline({ dispute }) {
  const theme = useTheme()
  const roundsLength = dispute.rounds.length
  // const current = 4
  // const courtSettings = useCourtSettings()
  // const disputeTimeLine = getDisputeTimeLine(dispute, courtSettings)

  const disputeTimeLine = [
    {
      phase: DisputesTypes.convertFromString('Created'),
      endTime: 1578529045000,
    },
    {
      phase: DisputesTypes.convertFromString('Evidence'),
      endTime: 1578530305000,
      active: false,
    },
    [
      [
        {
          phase: DisputesTypes.convertFromString('Drafting'),
          endTime: 1578529225000,
          active: false,
        },
        {
          phase: DisputesTypes.convertFromString('Committing'),
          endTime: 1578529225000,
          active: false,
        },
        {
          phase: DisputesTypes.convertFromString('Revealing'),
          endTime: 1578529225000,
          active: false,
        },
        {
          phase: DisputesTypes.convertFromString('Appeal'),
          endTime: 1578529225000,
          active: false,
        },
        {
          phase: DisputesTypes.convertFromString('ConfirmAppeal'),
          endTime: 1578529225000,
          active: true,
        },
      ],
    ],
  ]

  return (
    <div>
      <Stepper
        lineColor="#FFCDC5"
        lineTop={15}
        css={`
          padding: ${3 * GU}px 0;
        `}
      >
        {disputeTimeLine.map((item, index) => {
          if (!Array.isArray(item)) {
            return getStep(item, index, theme)
          } else {
            return item.map((round, roundIndex) => {
              console.log('roundIndex ', roundIndex)
              console.log('roundsLength ', roundsLength)
              if (roundIndex < roundsLength - 1) {
                return round.map((roundItem, phaseIndex) => {
                  return getStep(roundItem, phaseIndex, theme)
                })
              } else {
                return (
                  <Accordion
                    key={roundIndex}
                    items={[
                      [
                        <span
                          css={`
                            margin-left: ${GU * 1.5}px;
                          `}
                        >
                          Round 1
                        </span>,
                        <Stepper
                          lineColor="#FFCDC5"
                          lineTop={15}
                          css={`
                            padding: ${3 * GU}px 0;
                          `}
                        >
                          {round.map((roundItem, phaseIndex) => {
                            return getStep(roundItem, phaseIndex, theme)
                          })}
                        </Stepper>,
                      ],
                    ]}
                  />
                )
              }
            })
          }
        })}
      </Stepper>
    </div>
  )
}

function getStep(item, index, theme) {
  return (
    <Step
      key={index}
      active={item.active}
      stepPoint={
        <div
          css={`
            background: ${item.active
              ? 'linear-gradient(51.69deg, #FFB36D -0.55%, #FF8888 88.44%)'
              : '#FFE2D7'};
            border-radius: 80%;
            padding: 10px;
            position: relative;
            z-index: 2;
            display: inline-flex;
          `}
        >
          {getPhaseIcon(item.phase, item.active, theme)}
        </div>
      }
      content={
        <div>
          <div>
            <span css={textStyle('body1')}>
              {DisputesTypes.convertToString(item.phase)}
            </span>
          </div>
          <div>
            <span
              css={`
                color: ${theme.contentSecondary};
                opacity: 0.6;
              `}
            >
              {item.endTime}
            </span>
          </div>
          {item.active && (
            <div>
              <span
                css={`
                  ${textStyle('label3')}
                  text-transform: Uppercase;
                  background: rgba(200, 215, 234, 0.4);
                  border-radius: 100px;
                  padding: 5px 10px;
                `}
              >
                current
              </span>
            </div>
          )}
        </div>
      }
    />
  )
}

function getPhaseIcon(phase, active, theme) {
  if (phase === DisputesTypes.Phase.Created) {
    return <IconFlag color={active ? '#fff' : theme.surfaceIcon} />
  }

  if (phase === DisputesTypes.Phase.Evidence) {
    return <IconFolder color={active ? '#fff' : theme.surfaceIcon} />
  }

  if (phase === DisputesTypes.Phase.JuryDrafting) {
    return <IconGroup color={active ? '#fff' : theme.surfaceIcon} />
  }
  if (phase === DisputesTypes.Phase.VotingPeriod) {
    return <IconVote color={active ? '#fff' : theme.surfaceIcon} />
  }

  if (phase === DisputesTypes.Phase.RevealVote) {
    return <IconVote color={active ? '#fff' : theme.surfaceIcon} />
  }

  if (phase === DisputesTypes.Phase.AppealRuling) {
    return <IconWrite color={active ? '#fff' : theme.surfaceIcon} />
  }
  if (phase === DisputesTypes.Phase.ConfirmAppeal) {
    return <IconWrite color={active ? '#fff' : theme.surfaceIcon} />
  }
}

export default DisputeTimeline

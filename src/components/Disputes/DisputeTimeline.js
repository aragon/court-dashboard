import React from 'react'
import styled from 'styled-components'
import { Accordion, GU, textStyle, useTheme, Timer } from '@aragon/ui'
import dayjs from '../../lib/dayjs'
import { dateFormat } from '../../utils/date-utils'
import Stepper from '../Stepper'
import Step from '../Step'
import {
  IconFlag,
  IconFolder,
  IconUsers,
  IconThinking,
  IconRuling,
  IconVoting,
  IconGavelNoFill,
  IconRewards,
} from '../../utils/dispute-icons'

import * as DisputesTypes from '../../types/dispute-status-types'
import { getDisputeTimeLine } from '../../utils/dispute-utils'
import { numberToWord } from '../../lib/math-utils'
import { useCourtConfig } from '../../providers/CourtConfig'

const DisputeTimeline = React.memo(function DisputeTimeline({ dispute }) {
  const theme = useTheme()
  const courtConfig = useCourtConfig()
  const disputeTimeLine = getDisputeTimeLine(dispute, courtConfig)

  return (
    <div>
      <Stepper lineColor={theme.accent.alpha(0.3)} lineTop={12}>
        {disputeTimeLine.map((item, index) => {
          if (!Array.isArray(item)) {
            return getStep(item, index, theme)
          } else {
            return item.map((round, roundIndex) => {
              if (roundIndex === 0) {
                return round.map((roundItem, phaseIndex) => {
                  return getStep(roundItem, phaseIndex, theme)
                })
              } else {
                return (
                  <Step
                    key={roundIndex}
                    active={false}
                    content={
                      <div
                        css={`
                          width: 100%;
                        `}
                      >
                        <StyledAccordion>
                          <Accordion
                            key={roundIndex}
                            items={[
                              [
                                <div
                                  css={`
                                    display: flex;
                                    align-items: center;
                                  `}
                                >
                                  <img
                                    alt={18}
                                    src={IconGavelNoFill}
                                    css={`
                                      margin-right: ${1 * GU}px;
                                    `}
                                  />
                                  <RoundPill roundId={round[0].roundId} />
                                </div>,

                                <Stepper
                                  lineColor={theme.accent.alpha(0.3)}
                                  lineTop={12}
                                  css={`
                                    padding: ${3 * GU}px 0;
                                  `}
                                >
                                  {round.map((roundItem, phaseIndex) => {
                                    return getStep(
                                      roundItem,
                                      phaseIndex,
                                      theme,
                                      roundStepContainerCss
                                    )
                                  })}
                                </Stepper>,
                              ],
                            ]}
                          />
                        </StyledAccordion>
                      </div>
                    }
                    displayPoint={false}
                  />
                )
              }
            })
          }
        })}
      </Stepper>
    </div>
  )
})

function getStep(item, index, theme, css) {
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
            position: relative;
            z-index: 2;
            display: inline-flex;
          `}
        >
          {getPhaseIcon(item.phase, item.active)}
        </div>
      }
      content={
        <div>
          <div
            css={`
              margin-bottom: ${3 * GU}px;
            `}
          >
            <div>
              <span css={textStyle('body1')}>
                {DisputesTypes.getPhaseStringForStatus(item.phase, item.active)}
              </span>
            </div>
            <div>
              <span
                css={`
                  color: ${theme.contentSecondary};
                  opacity: 0.6;
                `}
              >
                {getDisplayTime(item)}
              </span>
            </div>
            {item.active && <RoundPill roundId={item.roundId} />}
          </div>
        </div>
      }
      displayPoint
      css={css}
    />
  )
}

function getPhaseIcon(phase, active) {
  let icon

  if (
    phase === DisputesTypes.Phase.Created ||
    phase === DisputesTypes.Phase.NotStarted
  ) {
    icon = IconFlag
  } else if (phase === DisputesTypes.Phase.Evidence) {
    icon = IconFolder
  } else if (phase === DisputesTypes.Phase.JuryDrafting) {
    icon = IconUsers
  } else if (
    phase === DisputesTypes.Phase.VotingPeriod ||
    phase === DisputesTypes.Phase.RevealVote
  ) {
    icon = IconVoting
  } else if (
    phase === DisputesTypes.Phase.AppealRuling ||
    phase === DisputesTypes.Phase.ConfirmAppeal
  ) {
    icon = IconThinking
  } else if (phase === DisputesTypes.Phase.ExecuteRuling) {
    icon = IconRuling
  } else {
    icon = IconRewards
  }

  return (
    <img
      css={`
        height: ${GU * 6}px;
      `}
      src={active ? icon.active : icon.inactive}
      alt="phase-icon"
    />
  )
}

function RoundPill({ roundId }) {
  if (roundId === undefined) return null

  const label = `Round ${numberToWord(roundId)}`

  return (
    <span
      css={`
        padding: 1px 16px;
        border-radius: 100px;
        background: linear-gradient(
          13.81deg,
          rgba(255, 179, 109, 0.3) -0.55%,
          rgba(255, 136, 136, 0.3) 88.44%
        );
        text-transform: uppercase;
        font-size: 12px;
        color: #e9756c;
        margin-top: 2px;
      `}
    >
      {label}
    </span>
  )
}

function getDisplayTime(timeLineItem) {
  const { endTime, active, phase } = timeLineItem

  if (active) {
    if (
      phase === DisputesTypes.Phase.ExecuteRuling ||
      phase === DisputesTypes.Phase.ClaimRewards
    ) {
      return 'ANY TIME'
    }
    return <Timer end={dayjs(endTime)} />
  }

  return dateFormat(endTime, 'DD/MM/YY')
}

const StyledAccordion = styled.div`
  & > div:first-child {
    border-radius: 0px;
    border-left: 0;
    border-right: 0;
  }
  padding: 0;
`
const roundStepContainerCss = `margin-left: 0px;`

export default DisputeTimeline

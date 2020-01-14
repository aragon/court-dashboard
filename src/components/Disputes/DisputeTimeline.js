import React from 'react'
import {
  Accordion,
  GU,
  textStyle,
  useTheme,
  IconFolder,
  IconFlag,
  IconGroup,
  IconVote,
  IconWrite,
  Timer,
} from '@aragon/ui'
import dayjs from '../../lib/dayjs'
import Stepper from '../Stepper'
import Step from '../Step'
import * as DisputesTypes from '../../types/types'
import styled from 'styled-components'
import { useCourtSettings } from '../../court-settings-manager'
import { getDisputeTimeLine } from '../../utils/disputeUtils'

function DisputeTimeline({ dispute }) {
  const theme = useTheme()
  const roundsLength = dispute.rounds.length

  const courtSettings = useCourtSettings()
  const disputeTimeLine = getDisputeTimeLine(dispute, courtSettings)

  const reverseTimeLine = disputeTimeLine.reverse().map(item => {
    if (Array.isArray(item)) {
      return item.reverse().map(roundPhase => {
        return roundPhase.reverse()
      })
    }
    return item
  })

  return (
    <div>
      <Stepper
        lineColor="#FFCDC5"
        lineTop={13}
        css={`
          padding-bottom: ${3 * GU}px;
        `}
      >
        {reverseTimeLine.map((item, index) => {
          if (!Array.isArray(item)) {
            return getStep(item, roundsLength, index, theme)
          } else {
            return item.map((round, roundIndex) => {
              if (roundIndex === 0) {
                return round.map((roundItem, phaseIndex) => {
                  return getStep(roundItem, roundsLength, phaseIndex, theme)
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
                                <span
                                  css={`
                                    margin-left: ${GU * 1.5}px;
                                  `}
                                >
                                  {getRoundPill(round[0].roundId)}
                                </span>,
                                <Stepper
                                  lineColor="#FFCDC5"
                                  lineTop={13}
                                  css={`
                                    padding: ${3 * GU}px 0;
                                  `}
                                >
                                  {round.map((roundItem, phaseIndex) => {
                                    return getStep(
                                      roundItem,
                                      roundsLength,
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
}

function getStep(item, roundId, index, theme, css) {
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
            {item.active && getRoundPill(item.roundId)}
          </div>
        </div>
      }
      displayPoint
      css={css}
    />
  )
}

function getPhaseIcon(phase, active, theme) {
  // TODO - change this for the new icons
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
    return (
      <IconWrite
        color={active ? '#fff' : theme.surfaceIcon}
        background="#fff"
      />
    )
  }
  if (phase === DisputesTypes.Phase.ConfirmAppeal) {
    return <IconWrite color={active ? '#fff' : theme.surfaceIcon} />
  }
}

function getRoundPill(roundId) {
  let label

  if (roundId === 0) {
    label = 'Round One'
  }
  if (roundId === 1) {
    label = 'Round Two'
  }
  if (roundId === 2) {
    label = 'Round Three'
  }

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
  const { endTime, active } = timeLineItem

  if (active) {
    return <Timer end={dayjs(endTime)} />
  }

  return dayjs(endTime).format('DD/MM/YY')
}

export default DisputeTimeline

const StyledAccordion = styled.div`
  & > div:first-child {
    border-radius: 0px;
  }
`
const roundStepContainerCss = `margin-left: 0px;`

import React from 'react'
import { Accordion, GU, textStyle, useTheme, Timer } from '@aragon/ui'
import IconFlagActive from '../../assets/IconFlagActive.svg'
import IconFlagInactive from '../../assets/IconFlagInactive.svg'
import IconFolderActive from '../../assets/IconFolderActive.svg'
import IconFolderInactive from '../../assets/IconFolderInactive.svg'
import IconUsersActive from '../../assets/IconUsersActive.svg'
import IconUsersInactive from '../../assets/IconUsersInactive.svg'
import IconVotingActive from '../../assets/IconVotingActive.svg'
import IconVotingInactive from '../../assets/IconVotingInactive.svg'
import IconThinkingActive from '../../assets/IconThinkingActive.svg'
import IconThinkingInactive from '../../assets/IconThinkingInactive.svg'
import IconRulingActive from '../../assets/IconRulingActive.svg'
import IconRulingInactive from '../../assets/IconRulingInactive.svg'
import dayjs from '../../lib/dayjs'
import { dateFormat } from '../../utils/date-utils'
import Stepper from '../Stepper'
import Step from '../Step'
import * as DisputesTypes from '../../types/types'
import styled from 'styled-components'
import { useCourtConfig } from '../../providers/CourtConfig'
import { getDisputeTimeLine } from '../../utils/dispute-utils'

function DisputeTimeline({ dispute }) {
  const theme = useTheme()
  const roundsLength = dispute.rounds.length
  const courtConfig = useCourtConfig()
  const disputeTimeLine = getDisputeTimeLine(dispute, courtConfig)

  const reverseTimeLine = [...disputeTimeLine].reverse().map(item => {
    if (Array.isArray(item)) {
      return [...item].reverse().map(roundPhase => {
        return [...roundPhase].reverse()
      })
    }
    return item
  })

  console.log('reverseTimeLine ', reverseTimeLine)

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
          }
          return item.map((round, roundIndex) => {
            if (roundIndex === 0) {
              return round.map((roundItem, phaseIndex) => {
                return getStep(roundItem, roundsLength, phaseIndex, theme)
              })
            }
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
                              <RoundPill roundId={Number(round[0].roundId)} />
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
          })
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
            {item.active && <RoundPill roundId={Number(item.roundId)} />}
          </div>
        </div>
      }
      displayPoint
      css={css}
    />
  )
}

function getPhaseIcon(phase, active) {
  // TODO - change this for the new icons
  if (phase === DisputesTypes.Phase.Created) {
    return (
      <img
        css={`
          height: ${GU * 6}px;
        `}
        src={active ? IconFlagActive : IconFlagInactive}
        alt="flag-icon"
      />
    )
  }

  if (phase === DisputesTypes.Phase.Evidence) {
    return (
      <img
        css={`
          height: ${GU * 6}px;
        `}
        src={active ? IconFolderActive : IconFolderInactive}
        alt="flag-icon"
      />
    )
  }

  if (phase === DisputesTypes.Phase.JuryDrafting) {
    return (
      <img
        css={`
          height: ${GU * 6}px;
        `}
        src={active ? IconUsersActive : IconUsersInactive}
        alt="flag-icon"
      />
    )
  }
  if (
    phase === DisputesTypes.Phase.VotingPeriod ||
    phase === DisputesTypes.Phase.RevealVote
  ) {
    return (
      <img
        css={`
          height: ${GU * 6}px;
        `}
        src={active ? IconVotingActive : IconVotingInactive}
        alt="flag-icon"
      />
    )
  }

  if (
    phase === DisputesTypes.Phase.AppealRuling ||
    phase === DisputesTypes.Phase.ConfirmAppeal
  ) {
    return (
      <img
        css={`
          height: ${GU * 6}px;
        `}
        src={active ? IconThinkingActive : IconThinkingInactive}
        alt="thinking-icon"
      />
    )
  }
  if (phase === DisputesTypes.Phase.ExecuteRuling) {
    return (
      <img
        css={`
          height: ${GU * 6}px;
        `}
        src={active ? IconRulingActive : IconRulingInactive}
        alt="ruling-icon"
      />
    )
  }
}

function RoundPill({ roundId }) {
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

export default DisputeTimeline

const StyledAccordion = styled.div`
  & > div:first-child {
    border-radius: 0px;
  }
`
const roundStepContainerCss = `margin-left: 0px;`

import React from 'react'
import { Accordion, GU, textStyle, useTheme, Timer } from '@aragon/ui'
import {
  IconFlag,
  IconFolder,
  IconUsers,
  IconThinking,
  IconRuling,
  IconVoting,
  IconRewards,
} from '../../utils/dispute-icons'
import dayjs from '../../lib/dayjs'
import { dateFormat } from '../../utils/date-utils'
import Stepper from '../Stepper'
import Step from '../Step'
import * as DisputesTypes from '../../types/types'
import styled from 'styled-components'
import { useCourtConfig } from '../../providers/CourtConfig'
import { getDisputeTimeLine } from '../../utils/dispute-utils'

function DisputeTimeline({ dispute }) {
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
            return <ItemStep key={index} item={item} index={index} />
          }
          return item.map((round, roundIndex) => {
            if (roundIndex === 0) {
              return round.map((roundItem, phaseIndex) => (
                <ItemStep
                  key={phaseIndex}
                  item={roundItem}
                  index={phaseIndex}
                />
              ))
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
                              {round.map((roundItem, phaseIndex) => (
                                <ItemStep
                                  key={phaseIndex}
                                  item={roundItem}
                                  index={phaseIndex}
                                  roundStepContainer
                                />
                              ))}
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

function ItemStep({ item, index, roundStepContainer }) {
  const theme = useTheme()
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
          <PhaseIcon phase={item.phase} active={item.active} />
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
                <DisplayTime item={item} />
              </span>
            </div>
            {item.active && <RoundPill roundId={Number(item.roundId)} />}
          </div>
        </div>
      }
      displayPoint
      css={`
        ${roundStepContainer ? 'margin-left: 0px;' : ''}
      `}
    />
  )
}

function PhaseIcon({ phase, active }) {
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

function DisplayTime({ item }) {
  const { endTime, active } = item
  if (active) {
    return <Timer end={dayjs(endTime)} />
  }
  return <>{dateFormat(endTime, 'DD/MM/YY')}</>
}

const StyledAccordion = styled.div`
  & > div:first-child {
    border-radius: 0px;
  }
`

export default DisputeTimeline

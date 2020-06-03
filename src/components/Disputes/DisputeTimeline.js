import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Accordion, GU, textStyle, useTheme, Timer } from '@aragon/ui'

import DisputeOutcomeText from './DisputeOutcomeText'
import DisputeRoundPill from './DisputeRoundPill'
import Step from '../Step'
import Stepper from '../Stepper'

import { useCourtClock } from '../../providers/CourtClock'
import { useCourtConfig } from '../../providers/CourtConfig'

import {
  IconFlag,
  IconFolder,
  IconGavelNoFill,
  IconRewards,
  IconRuling,
  IconThinking,
  IconUsers,
  IconVoting,
} from '../../utils/dispute-icons'

import {
  Phase as DisputePhase,
  getPhaseStringForStatus,
} from '../../types/dispute-status-types'
import { dateFormat } from '../../utils/date-utils'
import { getDisputeTimeLine } from '../../utils/dispute-utils'

const DisputeTimeline = React.memo(function DisputeTimeline({ dispute }) {
  const theme = useTheme()
  const courtConfig = useCourtConfig()
  const { currentTermId } = useCourtClock()
  const disputeTimeLine = getDisputeTimeLine(
    dispute,
    courtConfig,
    currentTermId
  )

  return (
    <div>
      <Stepper lineColor={theme.accent.alpha(0.3)} lineTop={12}>
        {disputeTimeLine.map((item, index) => {
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
                              <DisputeRoundPill roundId={round[0].roundId} />
                            </div>,

                            <Stepper
                              lineColor={theme.accent.alpha(0.3)}
                              lineTop={12}
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
})

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
            z-index: 1;
            display: inline-flex;
          `}
        >
          <PhaseIcon phase={item.phase} active={item.active} />
        </div>
      }
      content={
        <div>
          <div>
            <div>
              <span css={textStyle('body1')}>
                {getPhaseStringForStatus(item.phase, item.active)}
              </span>
            </div>
            <div>
              <span
                css={`
                  color: ${theme.surfaceContentSecondary};
                  opacity: 0.6;
                `}
              >
                <DisplayTime item={item} />
              </span>
            </div>
            {item.active && <DisputeRoundPill roundId={item.roundId} />}
            {item.showOutcome && (
              <Outcome outcome={item.outcome} phase={item.phase} />
            )}
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

function Outcome({ outcome, phase }) {
  const theme = useTheme()
  const title =
    phase && phase === DisputePhase.RevealVote ? 'Jury outcome' : 'Outcome'

  return (
    <div
      css={`
        position: relative;
      `}
    >
      <OutcomePoint />
      <div
        css={`
          margin-top: ${1 * GU}px;
        `}
      >
        <span
          css={`
            ${textStyle('body3')}
            color:${theme.surfaceContentSecondary};
            text-transform: uppercase;
          `}
        >
          {title}
        </span>
      </div>
      <DisputeOutcomeText outcome={outcome} phase={phase} />
    </div>
  )
}

function PhaseIcon({ phase, active }) {
  const icon = useMemo(() => {
    if (phase === DisputePhase.Created || phase === DisputePhase.NotStarted) {
      return IconFlag
    }
    if (phase === DisputePhase.Evidence) {
      return IconFolder
    }
    if (phase === DisputePhase.JuryDrafting) {
      return IconUsers
    }
    if (
      phase === DisputePhase.VotingPeriod ||
      phase === DisputePhase.RevealVote
    ) {
      return IconVoting
    }
    if (
      phase === DisputePhase.AppealRuling ||
      phase === DisputePhase.ConfirmAppeal
    ) {
      return IconThinking
    }
    if (phase === DisputePhase.ExecuteRuling) {
      return IconRuling
    }
    return IconRewards
  }, [phase])

  return (
    <img
      src={active ? icon.active : icon.inactive}
      width={6 * GU}
      height={6 * GU}
      alt=""
    />
  )
}

function DisplayTime({ item }) {
  const { endTime, active } = item
  if (active) {
    if (!endTime) {
      return 'ANY TIME'
    }
    return <Timer end={new Date(endTime)} maxUnits={3} />
  }
  return <>{dateFormat(endTime, 'onlyDate')}</>
}

function OutcomePoint() {
  const theme = useTheme()

  return (
    <div
      css={`
        position: absolute;
        top: 5px;
        left: -44px;
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fef3f1;
        border-radius: 50%;
      `}
    >
      <div
        css={`
          width: 6px;
          height: 6px;
          background: ${theme.accent.alpha(0.3)};
          border-radius: 50%;
        `}
      />
    </div>
  )
}

const StyledAccordion = styled.div`
  padding: 0;

  & > div:first-child {
    border-radius: 0px;
    border-left: 0;
    border-right: 0;
  }

  &::after {
    height: 0px !important;
    width: 0px !important;
  }
`

export default DisputeTimeline

import React from 'react'
import styled from 'styled-components'
import {
  Accordion,
  GU,
  IconClose,
  IconCheck,
  textStyle,
  useTheme,
  Timer,
} from '@aragon/ui'
import {
  IconFlag,
  IconFolder,
  IconUsers,
  IconThinking,
  IconRuling,
  IconVoting,
  IconRewards,
  IconGavelNoFill,
} from '../../utils/dispute-icons'

import dayjs from '../../lib/dayjs'
import { dateFormat } from '../../utils/date-utils'
import Stepper from '../Stepper'
import Step from '../Step'

import * as DisputesTypes from '../../types/dispute-status-types'
import { getDisputeTimeLine } from '../../utils/dispute-utils'
import { numberToWord } from '../../lib/math-utils'
import { useCourtConfig } from '../../providers/CourtConfig'
import {
  outcomeToAppealString,
  OUTCOMES,
  NOBODY_APPEALED,
  NOBODY_CONFIRMED,
} from '../../utils/crvoting-utils'

const DisputeTimeline = React.memo(function DisputeTimeline({ dispute }) {
  const theme = useTheme()
  const courtConfig = useCourtConfig()
  const disputeTimeLine = getDisputeTimeLine(dispute, courtConfig)
  console.log('dispute time ', disputeTimeLine)
  console.log('DisputeTimeline dispute ', dispute)

  return (
    <div>
      <Stepper lineColor={theme.accent.alpha(0.3)} lineTop={12}>
        {disputeTimeLine.map((item, index) => {
          if (!Array.isArray(item)) {
            return <ItemStep key={index} item={item} index={index} />
          } else {
            return item.map((round, roundIndex) => {
              if (roundIndex === 0) {
                return round.map((roundItem, phaseIndex) => (
                  <ItemStep
                    key={phaseIndex}
                    item={roundItem}
                    index={phaseIndex}
                  />
                ))
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
              }
            })
          }
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
            {item.active && <RoundPill roundId={item.roundId} />}
            {item.outcome && (
              <Outcome item={item} outcome={item.outcome} phase={item.phase} />
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

function Outcome({ item, outcome, phase }) {
  console.log('ROUND ITEM ', item)
  console.log('oooouutt ', outcome)
  if (outcome) {
    const title =
      phase && phase === DisputesTypes.Phase.RevealVote
        ? 'JURY OUTCOME'
        : 'OUTCOME'
    return (
      <React.Fragment>
        <div
          css={`
            margin-top: ${1 * GU}px;
          `}
        >
          <span
            css={`
              ${textStyle('body3')}
              color:#637381;
            `}
          >
            {title}
          </span>
        </div>
        <OutcomeText outcome={outcome} />
      </React.Fragment>
    )
  }
  return null
}

function OutcomeText({ outcome }) {
  const theme = useTheme()
  // let icon
  let Icon
  // let outcomeText
  let color
  if (
    outcome === outcomeToAppealString(OUTCOMES.Refused) ||
    outcome === NOBODY_APPEALED ||
    outcome === NOBODY_CONFIRMED
  ) {
    Icon = IconClose
    color = '#8fa4b5'
  }
  if (outcome === outcomeToAppealString(OUTCOMES.Against)) {
    Icon = IconClose
    color = theme.negative
  }
  if (outcome === outcomeToAppealString(OUTCOMES.InFavor)) {
    Icon = IconCheck
    color = theme.positive
  }

  return (
    <div>
      {Icon && (
        <div
          css={`
            color: ${color};
            display: flex;
            align-items: center;
          `}
        >
          <Icon size="medium" />
          <span
            css={`
              ${textStyle('body2')}
            `}
          >
            {outcome}
          </span>
        </div>
      )}
    </div>
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

function DisplayTime({ item }) {
  const { endTime, active, phase } = item
  if (active) {
    if (
      phase === DisputesTypes.Phase.ExecuteRuling ||
      phase === DisputesTypes.Phase.ClaimRewards
    ) {
      return 'ANY TIME'
    }
    return <Timer end={dayjs(endTime)} />
  }
  return <>{dateFormat(endTime, 'DD/MM/YY')}</>
}

const StyledAccordion = styled.div`
  & > div:first-child {
    border-radius: 0px;
    border-left: 0;
    border-right: 0;
  }
  padding: 0;
`

export default DisputeTimeline

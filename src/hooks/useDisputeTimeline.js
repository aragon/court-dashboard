import { useMemo } from 'react'
import { Phase as DisputePhase } from '../types/dispute-status-types'
import { getTermEndTime } from '../utils/court-utils'
import {
  getEvidenceSubmissionEndTerm,
  getPhaseAndTransition,
  getRoundPhasesAndTime,
} from '../utils/dispute-utils'
import { useCourtConfig } from '../providers/CourtConfig'
import { useCourtClock } from '../providers/CourtClock'

/**
 * Construct dispute timeline for the given dispute
 * @param {Object} dispute The dispute to get the timeline from
 * @param {Object} courtConfig The court configuration
 * @param {Number} currentTerm The court current term
 * @returns {Array} The timeline of the given dispute
 */
export default function useDisputeTimeline(dispute) {
  const courtConfig = useCourtConfig()
  const { currentTermId } = useCourtClock()
  const { createdAt } = dispute

  const currentPhase = getPhaseAndTransition(
    dispute,
    currentTermId,
    courtConfig
  )

  const evidenceSubmissionEndTerm = getEvidenceSubmissionEndTerm(
    dispute,
    courtConfig
  )
  const evidenceSubmissionEndTime = getTermEndTime(
    evidenceSubmissionEndTerm,
    courtConfig
  )

  return useMemo(
    () => {
      const timeLine = [
        {
          phase: DisputePhase.Evidence,
          endTime: evidenceSubmissionEndTime,
          active: currentPhase.phase === DisputePhase.Evidence,
          roundId: 0,
        },
        {
          phase: DisputePhase.Created, // create Symbol
          endTime: createdAt,
        },
      ]

      const rounds = []
      dispute.rounds.forEach(round => {
        const roundPhases = getRoundPhasesAndTime(
          round,
          currentPhase,
          currentTermId,
          courtConfig
        )
        rounds.unshift([...roundPhases].reverse())
      })

      if (rounds.length === 0) {
        return timeLine
      }

      timeLine.unshift(rounds)

      if (
        currentPhase.phase === DisputePhase.ExecuteRuling ||
        currentPhase.phase === DisputePhase.ClaimRewards
      ) {
        timeLine.unshift({
          phase: DisputePhase.ExecuteRuling,
          active: DisputePhase.ExecuteRuling === currentPhase.phase,
          roundId: currentPhase.roundId,
        })
      }

      if (currentPhase.phase === DisputePhase.ClaimRewards) {
        timeLine.unshift({
          phase: DisputePhase.ClaimRewards,
          active: currentPhase.phase === DisputePhase.ClaimRewards,
          roundId: currentPhase.roundId,
        })
      }

      return timeLine
    },

    // We are leaving out courtConfig and dispute.rounds as dependencies to prevent the timeline from being recomputed on every poll.
    // The current phase dependency is sufficient for recomputing it.
    // If there's a new round, means the phase has changed
    [createdAt, currentPhase.phase, evidenceSubmissionEndTime] // eslint-disable-line react-hooks/exhaustive-deps
  )
}

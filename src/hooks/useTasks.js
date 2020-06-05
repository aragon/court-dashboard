import { useMemo } from 'react'
import { useCourtClock } from '../providers/CourtClock'
import { useCourtConfig } from '../providers/CourtConfig'
import { useTasksSubscription } from './subscription-hooks'

import { getTermEndTime } from '../utils/court-utils'
import { getAdjudicationPhase } from '../utils/dispute-utils'
import {
  convertToString,
  getTaskActionString,
  Phase as DisputePhase,
} from '../types/dispute-status-types'
import { getVoidedDisputesByCourt } from '../flagged-disputes/voided-disputes'

export default function useTasks() {
  const courtConfig = useCourtConfig()
  const { currentTermId } = useCourtClock()
  const { tasks, fetching, error } = useTasksSubscription()

  const openTasks = useOpenTasks(tasks, currentTermId, courtConfig)

  return { openTasks, fetching, error }
}

function useOpenTasks(tasks, currentTermId, courtConfig) {
  const voidedDisputes = getVoidedDisputesByCourt()
  const convertedTasks = useMemo(() => {
    if (!tasks) {
      return null
    }
    return tasks.map(task => ({
      ...task,
      ...getAdjudicationPhase(task.dispute, task, currentTermId, courtConfig),
    }))
  }, [courtConfig, currentTermId, tasks])

  const convertedTasksPhasesKey = convertedTasks
    ? convertedTasks.map(phase => convertToString(phase.phase)).join('')
    : null

  const incompleteTasks = useMemo(() => {
    if (!convertedTasks) {
      return null
    }
    return convertedTasks.filter(
      task =>
        !voidedDisputes.has(task.dispute.id) &&
        task.phase !== DisputePhase.Ended
    )
  }, [convertedTasksPhasesKey, voidedDisputes]) // eslint-disable-line react-hooks/exhaustive-deps

  return useMemo(() => {
    if (!convertedTasks) {
      return []
    }
    const openTasks = []

    for (let i = 0; i < incompleteTasks.length; i++) {
      const currentPhase = incompleteTasks[i].phase
      const nextTransition = getTermEndTime(
        incompleteTasks[i].phaseEndTerm,
        courtConfig
      )

      if (
        currentPhase !== DisputePhase.AppealRuling &&
        currentPhase !== DisputePhase.ConfirmAppeal
      ) {
        for (let j = 0; j < incompleteTasks[i].jurors.length; j++) {
          if (isVotingTaskOpen(incompleteTasks[i].jurors[j], currentPhase)) {
            openTasks.push({
              number: incompleteTasks[i].number,
              state: incompleteTasks[i].state,
              createdAt: incompleteTasks[i].createdAt,
              juror: incompleteTasks[i].jurors[j].juror.id,
              disputeId: incompleteTasks[i].dispute.id,
              commitment: incompleteTasks[i].jurors[j].commitment,
              outcome: incompleteTasks[i].jurors[j].outcome,
              phase: getTaskActionString(currentPhase),
              phaseType: currentPhase,
              dueDate: nextTransition,
            })
          }
        }
      } else {
        if (isAppealTaskOpen(incompleteTasks[i], currentPhase)) {
          // We are in appeal or confirm and only need to generate a single task
          // (rather than one per juror) if the task is still open
          openTasks.push({
            number: incompleteTasks[i].number,
            state: incompleteTasks[i].state,
            createdAt: incompleteTasks[i].createdAt,
            juror: 'Anyone',
            disputeId: incompleteTasks[i].dispute.id,
            phase: getTaskActionString(currentPhase),
            phaseType: currentPhase,
            dueDate: nextTransition,
          })
        }
      }
    }
    return openTasks
    // Since we are using our own generated cache key we don't need to add the convertedTasks to the dependency list.
  }, [convertedTasksPhasesKey, incompleteTasks]) // eslint-disable-line react-hooks/exhaustive-deps
}

function isAppealTaskOpen(round, currentPhase) {
  if (currentPhase === DisputePhase.AppealRuling) {
    return !round.appeal
  }
  if (currentPhase === DisputePhase.ConfirmAppeal) {
    if (round?.appeal?.opposedRuling) {
      return Number(round.appeal.opposedRuling) === 0
    }

    return true
  }
}

function isVotingTaskOpen(draft, currentPhase) {
  if (currentPhase === DisputePhase.VotingPeriod) {
    return !draft.commitment
  }
  if (currentPhase === DisputePhase.RevealVote) {
    if (draft.outcome || !draft.commitment) {
      return false
    }
    return true
  }
}

import { useMemo } from 'react'
import useNow from './useNow'
import { useTasksSubscription } from './subscription-hooks'
import { getAdjudicationPhase } from '../utils/dispute-utils'
import * as DisputesTypes from '../types/dispute-status-types'
import { useCourtConfig } from '../providers/CourtConfig'
import { getVoidedDisputesByCourt } from '../voided-disputes'

export default function useTasks() {
  const courtConfig = useCourtConfig()
  const { tasks, fetching, error } = useTasksSubscription()
  const now = useNow()
  const openTasks = useOpenTasks(tasks, now, courtConfig)

  return { openTasks, fetching, error }
}

function useOpenTasks(tasks, now, courtSettings) {
  const voidedDisputes = getVoidedDisputesByCourt()
  const convertedTasks = useMemo(() => {
    if (!tasks) {
      return null
    }
    return tasks.map(task => ({
      ...task,
      ...getAdjudicationPhase(task.dispute, task, now, courtSettings),
    }))
  }, [courtSettings, now, tasks])

  const convertedTasksPhasesKey = convertedTasks
    ? convertedTasks
        .map(phase => DisputesTypes.convertToString(phase.phase))
        .join('')
    : null

  return useMemo(() => {
    if (!convertedTasks) {
      return []
    }
    const openTasks = []
    const incompleteTasks = convertedTasks.filter(
      task =>
        !voidedDisputes.has(task.dispute.id) &&
        task.phase !== DisputesTypes.Phase.Ended
    )

    for (let i = 0; i < incompleteTasks.length; i++) {
      const currentPhase = incompleteTasks[i].phase
      const nextTransition = incompleteTasks[i].nextTransition

      if (
        currentPhase !== DisputesTypes.Phase.AppealRuling &&
        currentPhase !== DisputesTypes.Phase.ConfirmAppeal
      ) {
        for (let j = 0; j < incompleteTasks[i].jurors.length; j++) {
          if (isVotingTaskOpen(incompleteTasks[i].jurors[j], currentPhase)) {
            openTasks.push({
              number: incompleteTasks[i].number,
              state: incompleteTasks[i].state,
              createdAt: parseInt(incompleteTasks[i].createdAt, 10) * 1000,
              juror: incompleteTasks[i].jurors[j].juror.id,
              disputeId: incompleteTasks[i].dispute.id,
              commitment: incompleteTasks[i].jurors[j].commitment,
              outcome: incompleteTasks[i].jurors[j].outcome,
              phase: getTaskName(currentPhase),
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
            createdAt: parseInt(incompleteTasks[i].createdAt, 10) * 1000,
            juror: 'Anyone',
            disputeId: incompleteTasks[i].dispute.id,
            phase: getTaskName(currentPhase),
            dueDate: nextTransition,
            phaseType: currentPhase,
          })
        }
      }
    }
    return openTasks
    // Since we are using our own generated cache key we don't need to add the convertedTasks to the dependency list.
  }, [convertedTasksPhasesKey, voidedDisputes]) // eslint-disable-line react-hooks/exhaustive-deps
}

function getTaskName(phase) {
  if (phase === DisputesTypes.Phase.VotingPeriod) {
    return 'Commit vote'
  }
  if (phase === DisputesTypes.Phase.RevealVote) {
    return 'Reveal vote'
  }
  if (phase === DisputesTypes.Phase.AppealRuling) {
    return 'Appeal ruling'
  }
  if (phase === DisputesTypes.Phase.ConfirmAppeal) {
    return 'Confirm appeal'
  }
}

function isAppealTaskOpen(round, currentPhase) {
  if (currentPhase === DisputesTypes.Phase.AppealRuling) {
    return !round.appeal
  }
  if (currentPhase === DisputesTypes.Phase.ConfirmAppeal) {
    if (round?.appeal?.opposedRuling) {
      return Number(round.appeal.opposedRuling) === 0
    }

    return true
  }
}

function isVotingTaskOpen(draft, currentPhase) {
  if (currentPhase === DisputesTypes.Phase.VotingPeriod) {
    return !draft.commitment
  }
  if (currentPhase === DisputesTypes.Phase.RevealVote) {
    if (draft.outcome || !draft.commitment) {
      return false
    }
    return true
  }
}

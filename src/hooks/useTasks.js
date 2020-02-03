import { useMemo } from 'react'
import useNow from './useNow'
import { useTasksSubscription } from './subscription-hooks'
import { getAdjudicationPhase } from '../utils/dispute-utils'
import * as DisputesTypes from '../types/dispute-status-types'
import { useCourtConfig } from '../providers/CourtConfig'

export default function useTasks() {
  const courtConfig = useCourtConfig()
  const { tasks, fetching, error } = useTasksSubscription()
  const now = useNow()

  return { openTasks: useOpenTasks(tasks, now, courtConfig), fetching, error }
}

function useOpenTasks(tasks, now, courtSettings) {
  const currentRoundPhases = useMemo(() => {
    if (!tasks) {
      return null
    }
    return tasks.map(t =>
      getAdjudicationPhase(t.dispute, t, now, courtSettings)
    )
  }, [courtSettings, now, tasks])

  const currentRoundPhasesKey = currentRoundPhases
    ? currentRoundPhases
        .map(phase => DisputesTypes.convertToString(phase.phase))
        .join('')
    : null

  return useMemo(() => {
    const openTasks = []
    if (tasks) {
      for (let i = 0; i < tasks.length; i++) {
        // If we are in appeal or confirm we just need to generate 1 task
        if (
          currentRoundPhases[i].phase === DisputesTypes.Phase.AppealRuling ||
          currentRoundPhases[i].phase === DisputesTypes.Phase.ConfirmAppeal
        ) {
          openTasks.push({
            number: tasks[i].number,
            state: tasks[i].state,
            createdAt: parseInt(tasks[i].createdAt, 10) * 1000,
            juror: 'Anyone',
            disputeId: tasks[i].dispute.id,
            phase: getTaskName(currentRoundPhases[i].phase),
            dueDate: currentRoundPhases[i].nextTransition,
            phaseType: currentRoundPhases[i].phase,
            open: true,
          })
        } else {
          for (let j = 0; j < tasks[i].jurors.length; j++) {
            if (currentRoundPhases[i].phase !== DisputesTypes.Phase.Ended) {
              openTasks.push({
                number: tasks[i].number,
                state: tasks[i].state,
                createdAt: parseInt(tasks[i].createdAt, 10) * 1000,
                juror: tasks[i].jurors[j].juror.id,
                disputeId: tasks[i].dispute.id,
                commitment: tasks[i].jurors[j].commitment,
                outcome: tasks[i].jurors[j].outcome,
                phase: getTaskName(currentRoundPhases[i].phase),
                phaseType: currentRoundPhases[i].phase,
                dueDate: currentRoundPhases[i].nextTransition,
                open: true,
              })
            }
          }
        }
      }
    }
    return openTasks
  }, [currentRoundPhasesKey, tasks]) // eslint-disable-line react-hooks/exhaustive-deps
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

import { useMemo } from 'react'
import useNow from './useNow'
import useTasksSubscription from './useTasksSubscription'
import { getAdjudicationPhase } from '../utils/dispute-utils'
import * as DisputesTypes from '../types/types'
import { useCourtConfig } from '../providers/CourtConfig'

export default function useRounds() {
  const courtConfig = useCourtConfig()
  const tasks = useTasksSubscription()
  const now = useNow()

  const openTasks = generateOpenTasks(tasks, now, courtConfig)
  // const openTasksNumber = openTasks.length

  const tasksPhasesKey = openTasks.map(t => t.disputeId).join('')
  console.log('tasksPhasesKey ', tasksPhasesKey)

  return [
    useMemo(() => {
      return openTasks
    }, [openTasks, tasksPhasesKey]), // eslint-disable-line react-hooks/exhaustive-deps
  ]
}

function generateOpenTasks(tasks, now, courtSettings) {
  console.log('ROUNDD GENERATE ', tasks)
  const openTasks = []
  for (let i = 0; i < tasks.length; i++) {
    const currentRoundPhase = getAdjudicationPhase(
      tasks[i].dispute,
      tasks[i],
      now,
      courtSettings
    )
    console.log('ROUND ID ', i)
    console.log('currentRoundPhase ', currentRoundPhase)
    // If we are in appeal or confirm we just need to generate 1 task
    if (
      currentRoundPhase.phase === DisputesTypes.Phase.AppealRuling ||
      currentRoundPhase.phase === DisputesTypes.Phase.ConfirmAppeal
    ) {
      openTasks.push({
        number: tasks[i].number,
        state: tasks[i].state,
        createdAt: parseInt(tasks[i].createdAt, 10) * 1000,
        juror: 'Anyone',
        disputeId: tasks[i].dispute.id,
        phase: getTaskName(currentRoundPhase.phase),
        dueDate: currentRoundPhase.nextTransition,
        phaseType: currentRoundPhase.phase,
        open: true,
      })
    } else {
      for (let j = 0; j < tasks[i].jurors.length; j++) {
        if (currentRoundPhase.phase !== DisputesTypes.Phase.Ended) {
          openTasks.push({
            number: tasks[i].number,
            state: tasks[i].state,
            createdAt: parseInt(tasks[i].createdAt, 10) * 1000,
            juror: tasks[i].jurors[j].juror.id,
            disputeId: tasks[i].dispute.id,
            commitment: tasks[i].jurors[j].commitment,
            outcome: tasks[i].jurors[j].outcome,
            phase: getTaskName(currentRoundPhase.phase),
            phaseType: currentRoundPhase.phase,
            dueDate: currentRoundPhase.nextTransition,
            open: true,
          })
        }
      }
    }
  }
  return openTasks
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

import { useMemo } from 'react'
import useNow from './useNow'
import useRoundsSubscription from './useRoundsSubscription'
import { getAdjudicationPhase } from '../utils/dispute-utils'
import * as DisputesTypes from '../types/dispute-status-types'
import { useCourtConfig } from '../providers/CourtConfig'

export default function useRounds() {
  const courtConfig = useCourtConfig()
  const rounds = useRoundsSubscription()
  console.log('ROunds ', rounds)
  const now = useNow()

  const tasks = generateTasksForOpenRounds(rounds, now, courtConfig)
  const openTasks = tasks.length

  const tasksPhasesKey = tasks.map(t => t.ongoing).join('')

  return useMemo(() => {
    return [tasks, openTasks]
  }, [openTasks, tasks, tasksPhasesKey]) // eslint-disable-line react-hooks/exhaustive-deps
}

function generateTasksForOpenRounds(rounds, now, courtSettings) {
  const tasks = []
  for (let i = 0; i < rounds.length; i++) {
    for (let j = 0; j < rounds[i].jurors.length; j++) {
      const currentRoundPhase = getAdjudicationPhase(
        rounds[i].dispute,
        rounds[i],
        now,
        courtSettings
      )
      if (currentRoundPhase.phase !== DisputesTypes.Phase.Ended) {
        tasks.push({
          number: rounds[i].number,
          state: rounds[i].state,
          createdAt: parseInt(rounds[i].createdAt, 10) * 1000,
          juror: rounds[i].jurors[j].juror.id,
          disputeId: rounds[i].dispute.id,
          commitment: rounds[i].jurors[j].commitment,
          outcome: rounds[i].jurors[j].outcome,
          phase: getTaskName(currentRoundPhase.phase),
          dueDate: currentRoundPhase.nextTransition,
          open: true,
        })
      }
    }
  }
  return tasks
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

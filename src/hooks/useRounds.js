import { useMemo } from 'react'
import useNow from './useNow'
import useRoundsSubscription from './useRoundsSubscription'
import { getCommitEndTime, getRevealEndTime } from '../utils/disputeUtils'
import { useCourtSettings } from '../court-settings-manager'
import * as DisputesTypes from '../types/types'

export default function useRounds() {
  const courtSettings = useCourtSettings()
  const rounds = useRoundsSubscription()
  const now = useNow()

  const tasks = generateTasksForRounds(rounds, now, courtSettings)

  const tasksPhasesKey = tasks.map(t => t.ongoing).join('')

  return [
    useMemo(() => {
      return tasks
    }, [tasks, tasksPhasesKey]), // eslint-disable-line react-hooks/exhaustive-deps
  ]
}

function generateTasksForRounds(rounds, now, courtSettings) {
  const tasks = []
  for (let i = 0; i < rounds.length; i++) {
    for (let j = 0; j < rounds[i].jurors.length; j++) {
      if (rounds[i].state !== DisputesTypes.Phase.Invalid) {
        const commitEndTime = getCommitEndTime(rounds[i], courtSettings)
        const revealEndTime = getRevealEndTime(rounds[i], courtSettings)

        // Add Commit tasks
        tasks.push({
          number: rounds[i].number,
          state: rounds[i].state,
          createdAt: parseInt(rounds[i].createdAt, 10) * 1000,
          juror: rounds[i].jurors[j].juror.id,
          disputeId: rounds[i].dispute.id,
          commitment: rounds[i].jurors[j].commitment,
          outcome: rounds[i].jurors[j].outcome,
          phase: 'Commit Vote',
          dueDate: commitEndTime,
          ongoing: now < commitEndTime,
        })

        // Add Reveal tasks
        tasks.push({
          number: rounds[i].number,
          state: rounds[i].state,
          createdAt: parseInt(rounds[i].createdAt, 10) * 1000,
          juror: rounds[i].jurors[j].juror.id,
          disputeId: rounds[i].dispute.id,
          commitment: rounds[i].jurors[j].commitment,
          outcome: rounds[i].jurors[j].outcome,
          phase: 'Reveal Vote',
          dueDate: revealEndTime,
          ongoing: now < revealEndTime,
        })
      }
    }
  }
  return tasks
}

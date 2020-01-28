import { useSubscription } from 'urql'
import { OpenTasks } from '../queries/tasks'

export default function useTasksSubscription() {
  // 1- Committing, 4-Confirming Appeal , 5- Ended
  const subscriptionVariables = { state: [1, 4] }

  const [{ data, error }] = useSubscription({
    query: OpenTasks,
    variables: subscriptionVariables,
  })

  const tasks = data ? data.adjudicationRounds : []

  return { tasks, error: error }
}

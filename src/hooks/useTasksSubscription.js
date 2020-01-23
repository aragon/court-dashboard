import { useState } from 'react'
import { useSubscription } from 'urql'
import { OpenTasks } from '../queries/tasks'

export default function useTasksSubscription() {
  const [tasks, setTasks] = useState([])

  // 1- Committing, 4-Confirming Appeal , 5- Ended
  const subscriptionVariables = { state: [1, 4] }

  // First argument is the last result from the query , second argument is the current response
  // See https://formidable.com/open-source/urql/docs/basics/#subscriptions - Usage with hooks
  const handleSubscription = (rounds = [], response) => {
    /** Here we are reducing all the response againg because the response is not returning only the new elements or modified elements
     So we don't have a way to know if some item was updated or not. The first argument is where the previouse subscription response comes
     */
    return setTasks(response.adjudicationRounds)
  }
  useSubscription(
    {
      query: OpenTasks,
      variables: subscriptionVariables,
    },
    handleSubscription
  )

  return tasks
}

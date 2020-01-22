import { useState } from 'react'
import { useSubscription } from 'urql'
import { OpenTasks } from '../queries/tasks'

const TASKS_PER_PAGE = 6

export default function useTasksSubscription(allTasks, onlyOpen, page) {
  const [tasks, setTasks] = useState([])

  // 1- Committing, 4-Confirming Appeal , 5- Ended
  let subscriptionVariables = onlyOpen ? { state: [1, 4] } : { state: [5] }

  if (allTasks) {
    subscriptionVariables = {
      ...subscriptionVariables,
      first: TASKS_PER_PAGE,
      skip: page * TASKS_PER_PAGE,
    }
  }
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

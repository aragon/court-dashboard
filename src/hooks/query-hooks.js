import { useQuery } from 'urql'
import { FirstActivationMovement } from '../queries/balances'

export function useFirstTimeActivation(jurorId, { pause, interval }) {
  const [result] = useQuery({
    query: FirstActivationMovement,
    variables: { id: jurorId },
    pause,
    // pollInterval: interval,
  })

  console.log('query activation', result)
}

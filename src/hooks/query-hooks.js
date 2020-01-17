import { useQuery } from 'urql'
import { FirstANJActivationMovement } from '../queries/balances'

export function useFirstANJActivation(jurorId, { pause = false }) {
  const [result] = useQuery({
    query: FirstANJActivationMovement,
    variables: { id: jurorId },
    pause,
  })

  const { juror } = result.data || {}

  return juror ? juror.movements[0] : null
}

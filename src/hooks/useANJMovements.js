import anjMovementTypes from '../types/anj-movement-types'
import {
  walletMovements,
  inactiveBalanceMovements,
  activeBalanceMovements,
} from '../utils/anj-movement-utils'

// Asummes movements in descending order of creation
export function useANJMovements(movements, decimals) {
  if (!movements.length) {
    return {}
  }

  const [
    filteredWalletMovements,
    filteredInactiveBalanceMovements,
    filteredActiveBalanceMovements,
  ] = getFilteredMovements(movements)

  // Get latest movement for each balance
  const latestWalletMovement = filteredWalletMovements[0]
  const latestInactiveBalanceMovement = filteredInactiveBalanceMovements[0]
  const latestActiveBalanceMovement = filteredActiveBalanceMovements[0]

  return {
    walletMovement: convertMovement(
      walletMovements,
      latestWalletMovement,
      decimals
    ),
    inactiveBalanceMovement: convertMovement(
      inactiveBalanceMovements,
      latestInactiveBalanceMovement,
      decimals
    ),
    activeBalanceMovement: convertMovement(
      activeBalanceMovements,
      latestActiveBalanceMovement,
      decimals
    ),
  }
}

function getFilteredMovements(movements) {
  const wallet = movements.filter(movement =>
    isMovementOf(walletMovements, anjMovementTypes[movement.type])
  )
  const inactive = movements.filter(movement =>
    isMovementOf(inactiveBalanceMovements, anjMovementTypes[movement.type])
  )
  const active = movements.filter(movement =>
    isMovementOf(activeBalanceMovements, anjMovementTypes[movement.type])
  )

  return [wallet, inactive, active]
}

function isMovementOf(movements, movementType) {
  return movements.some(movement => movement.type === movementType)
}

function convertMovement(movements, movement) {
  if (!movement) return null

  const movementType = anjMovementTypes[movement.type]
  const { direction } = movements.find(elem => elem.type === movementType)

  return {
    type: movementType,
    amount: movement.amount,
    direction,
  }
}

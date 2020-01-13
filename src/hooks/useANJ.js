import { useEffect, useState } from 'react'

import anjMovementTypes from '../types/anj-movement-types'
import {
  walletMovements,
  inactiveBalanceMovements,
  activeBalanceMovements,
} from '../utils/anj-movement-utils'

const PREFERRED_CURRENCY = 'USD'
const ANJ_SYMBOL = 'ANT' // TODO: change to ANJ when available

const API_BASE = 'https://min-api.cryptocompare.com/data'
const API_URL = `${API_BASE}/price?fsym=${ANJ_SYMBOL}&tsyms=${PREFERRED_CURRENCY}`

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

export function useANJRate() {
  const [ANJRate, setANJRate] = useState(0)

  useEffect(() => {
    const fetchRate = async () => {
      const res = await fetch(API_URL)
      const rate = await res.json()

      setANJRate(rate[PREFERRED_CURRENCY])
    }

    fetchRate()
  }, [])

  return ANJRate
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

function convertMovement(movements, movement, decimals) {
  if (!movement) return

  const movementType = anjMovementTypes[movement.type]
  const { direction } = movements.find(elem => elem.type === movementType)

  return {
    type: movementType,
    amount: movement.amount / Math.pow(10, decimals),
    direction,
  }
}

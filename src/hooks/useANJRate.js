import { useEffect, useState } from 'react'

const PREFERRED_CURRENCY = 'USD'
const ANJ_SYMBOL = 'ANT' // TODO: change to ANJ when available

const API_BASE = 'https://min-api.cryptocompare.com/data'
const API_URL = `${API_BASE}/price?fsym=${ANJ_SYMBOL}&tsyms=${PREFERRED_CURRENCY}`

export default function useANJRate() {
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

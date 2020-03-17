import { useEffect, useState } from 'react'
import dayjs from '../lib/dayjs'

export default function useNow(updateEvery = 1000) {
  const [now, setNow] = useState(dayjs())
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(dayjs())
    }, updateEvery)
    return () => {
      clearInterval(timer)
    }
  }, [updateEvery])
  return now
}

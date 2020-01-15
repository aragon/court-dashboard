import { useEffect, useRef } from 'react'

function useInterval(callback, delay, runBeforeInterval) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      if (runBeforeInterval) tick()
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay, runBeforeInterval])
}
export default useInterval

import { useEffect, useRef } from 'react'

function useInterval(callback, delay, runBeforeInterval) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  const cancelled = useRef(false)
  // Set up the interval.
  useEffect(() => {
    function tick(cancel) {
      savedCallback.current(cancel)
    }

    if (delay !== null) {
      if (runBeforeInterval) tick(cancelled.current)
      const id = setInterval(tick, delay)
      return () => {
        clearInterval(id)
        cancelled.current = true
      }
    }
  }, [delay, runBeforeInterval])
}
export default useInterval

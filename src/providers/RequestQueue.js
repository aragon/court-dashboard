import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const RequestQueueContext = React.createContext()

function RequestQueueProvider({ children }) {
  const [requestQueue, setRequestQueue] = useState([])

  const addRequests = useCallback(
    requests => {
      const newRequests = requestQueue.concat(requests)
      return setRequestQueue(newRequests)
    },
    [requestQueue]
  )

  const clearRequestQueue = useCallback(() => {
    return setRequestQueue([])
  }, [])

  return (
    <RequestQueueContext.Provider
      value={{
        addRequests,
        clearRequestQueue,
        requests: requestQueue,
      }}
    >
      {children}
    </RequestQueueContext.Provider>
  )
}

RequestQueueProvider.propTypes = {
  children: PropTypes.node,
}

function useRequestQueue() {
  return useContext(RequestQueueContext)
}

export { RequestQueueProvider, useRequestQueue }

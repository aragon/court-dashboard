import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const RequestQueueContext = React.createContext()

function RequestQueueProvider({ children }) {
  const [requestQueue, setRequestQueue] = useState([])

  const addRequest = useCallback(
    request => {
      const newRequests = [...requestQueue, request]
      return setRequestQueue(newRequests)
    },
    [requestQueue]
  )

  const addRequests = useCallback(
    requests => {
      const newRequests = [...requestQueue, ...requests]
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
        addRequest,
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

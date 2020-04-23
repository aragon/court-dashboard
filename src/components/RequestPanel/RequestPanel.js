import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { GU, SidePanel } from '@aragon/ui'
import { captureException } from '@sentry/browser'

import ConfirmRequest from './ConfirmRequest'
import RequestStatus from './RequestStatus'
import { useRequestQueue } from '../../providers/RequestQueue'
import {
  REQUEST_STATUS_CONFIRMED,
  REQUEST_STATUS_FAILED,
  REQUEST_STATUS_PENDING,
  REQUEST_STATUS_PROCESSED,
  REQUEST_STATUS_PROCESSING_FAILED,
  REQUEST_STATUS_UPCOMING,
} from './request-statuses'

const MAX_ATTEMPTS = 3

const INITIAL_STATE = {
  processed: 0,
  errorProcessing: -1,
  confirmed: 0,
  failed: -1,
  requesting: 0,
}

function RequestPanel() {
  const [attempts, setAttempts] = useState(0)
  const [progress, setProgress] = useState({
    ...INITIAL_STATE,
  })
  const { clearRequestQueue, requests } = useRequestQueue()

  const handleSignerClose = useCallback(() => {
    // Clear state
    setAttempts(0)
    setProgress({ ...INITIAL_STATE })
    clearRequestQueue()
  }, [clearRequestQueue])

  const handleNextAttempt = useCallback(() => {
    setAttempts(attempts => attempts + 1)
  }, [])

  const handleStartRequest = useCallback(() => {
    setProgress(progress => ({ ...progress, requesting: 1 }))
  }, [])

  const processRequest = useCallback(async request => {
    try {
      const requestProcess = await request.intent()
      // Mark request as processed
      setProgress(({ processed, ...progress }) => ({
        ...progress,
        processed: processed + 1,
        lastProcessedAt: Date.now(),
      }))

      return requestProcess
    } catch (err) {
      // Mark request as errored at processing
      setProgress(({ processed, ...progress }) => ({
        ...progress,
        errorProcessing: processed,
        processed,
      }))

      // Re throw error
      throw err
    }
  }, [])

  const ensureRequestConfirmed = useCallback(
    async request => {
      try {
        // Wait for request to be confirmed
        await request.wait()
        return setProgress(({ confirmed, ...progress }) => ({
          ...progress,
          confirmed: confirmed + 1,
        }))
      } catch (err) {
        // Mark request as failed
        setProgress(({ processed, ...progress }) => ({
          ...progress,
          failed: processed - 1,
          processed: processed - 1,
        }))

        // Re throw error
        throw err
      }
    },
    [setProgress]
  )

  // Get request statuses
  const requestStatus = useMemo(() => {
    if (!requests) {
      return []
    }

    const requiredConfirmedRequests = requests
      .map((req, index) => ({ ...req, index }))
      .filter(req => req.ensureConfirmation)

    const { confirmed, errorProcessing, failed, processed } = progress
    const status = (request, index) => {
      // Request processing failed
      if (errorProcessing !== -1 && index >= errorProcessing) {
        return REQUEST_STATUS_PROCESSING_FAILED
      }

      // Request confirmation failed
      if (failed !== -1 && index >= failed) {
        return REQUEST_STATUS_FAILED
      }

      if (request.ensureConfirmation) {
        const confirmedIndex = requiredConfirmedRequests.findIndex(
          req => req.index === index
        )

        // Request confirmed
        if (confirmedIndex < confirmed) {
          return REQUEST_STATUS_CONFIRMED
        }

        // Request pending
        if (index < processed) {
          return REQUEST_STATUS_PENDING
        }
      }

      // Request processed
      if (index < processed) {
        return REQUEST_STATUS_PROCESSED
      }

      // Transaction not processed
      return REQUEST_STATUS_UPCOMING
    }

    return requests.map((request, index) => status(request, index))
  }, [progress, requests])

  const allSuccess = useMemo(() => {
    const { confirmed, processed } = progress

    const requiredConfirmedRequests = requests.filter(
      request => request.ensureConfirmation
    ).length

    const allProcessed = processed > 0 && processed === requests.length
    const allConfirmed = confirmed === requiredConfirmedRequests
    return allProcessed && allConfirmed
  }, [progress, requests])

  const maxAttemptsReached = attempts >= MAX_ATTEMPTS

  // Create requests
  useEffect(
    () => {
      if (!progress.requesting || maxAttemptsReached) {
        return
      }

      if (attempts === 0) {
        setProgress(({ requesting }) => ({
          ...INITIAL_STATE,
          requesting,
        }))
      } else {
        setProgress(progress => ({
          ...progress,
          errorProcessing: -1,
          failed: -1,
        }))
      }

      let cancelled = false

      const createRequests = async () => {
        const filteredRequests = requests.slice(progress.processed)

        for (const request of filteredRequests) {
          if (cancelled) {
            break
          }

          try {
            const requestProcess = await processRequest(request)

            if (request.isTx && request.ensureConfirmation) {
              await ensureRequestConfirmed(requestProcess)

              // Execute callback function if required
              if (typeof request.callback === 'function') {
                request.callback()
              }
            }
          } catch (err) {
            console.error(`Error when executing '${request.description}':`, err)
            captureException(err)

            throw err
          }
        }
      }

      createRequests()

      return () => {
        cancelled = true
      }
    },
    // We'll remove `progress.processed` from the dependencies to prevent the effect from running every time we process a request
    // Note that we'll retry processing requests from the last failed one only if the user requests to do so
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      attempts,
      ensureRequestConfirmed,
      maxAttemptsReached,
      processRequest,
      requests,
      progress.requesting,
    ]
  )

  useEffect(() => {
    let timeout

    const startClearing = () => {
      timeout = setTimeout(() => {
        handleSignerClose()
      }, 3000)
    }

    if (maxAttemptsReached || allSuccess) {
      startClearing()
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [allSuccess, handleSignerClose, maxAttemptsReached, requests])

  const blockPanel =
    !maxAttemptsReached && requests.length > 1 && Boolean(progress.requesting)

  return (
    <SidePanel
      blocking={blockPanel}
      title="Confirm action"
      opened={requests.length > 0}
      onClose={handleSignerClose}
    >
      <div
        css={`
          margin-top: ${3 * GU}px;
        `}
      >
        {progress.requesting ? (
          <RequestStatus
            allSuccess={allSuccess}
            lastProcessedAt={progress.lastProcessedAt}
            maxAttemptsReached={maxAttemptsReached}
            onClosePanel={handleSignerClose}
            onNextAttempt={handleNextAttempt}
            requests={requests}
            requestStatus={requestStatus}
          />
        ) : (
          <ConfirmRequest
            descriptions={requests.map(request => request.description)}
            onStartRequest={handleStartRequest}
          />
        )}
      </div>
    </SidePanel>
  )
}

export default React.memo(RequestPanel)

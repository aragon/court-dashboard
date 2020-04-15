import React, { useMemo } from 'react'
import { Button, GU, IconCheck, IconCross, Info, useTheme } from '@aragon/ui'
import RequestStepItem from './RequestStepItem'
import { useWallet } from '../../providers/Wallet'
import { getProviderFromUseWalletId } from '../../ethereum-providers'
import {
  REQUEST_STATUS_CONFIRMED,
  REQUEST_STATUS_FAILED,
  REQUEST_STATUS_PENDING,
  REQUEST_STATUS_PROCESSED,
  REQUEST_STATUS_PROCESSING_FAILED,
} from './request-statuses'

function RequestStatus({
  allSuccess,
  lastProcessedAt,
  maxAttemptsReached,
  onClosePanel,
  onNextAttempt,
  requests,
  requestStatus,
}) {
  const theme = useTheme()

  const multipleRequests = requests.length > 1

  return (
    <div>
      <div
        css={`
          background: ${theme.feedbackSurface};
          height: ${44 * GU}px;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: center;
        `}
      >
        {multipleRequests ? (
          <MultiStepRequest
            lastProcessedAt={lastProcessedAt}
            requests={requests}
            requestStatus={requestStatus}
          />
        ) : (
          <SingleRequest request={requests[0]} status={requestStatus[0]} />
        )}
      </div>
      <div
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        <RequestStatusInfo
          allSuccess={allSuccess}
          multipleRequests={multipleRequests}
          maxAttemptsReached={maxAttemptsReached}
          onClosePanel={onClosePanel}
          onNextAttempt={onNextAttempt}
          requests={requests}
          requestStatus={requestStatus}
        />
      </div>
    </div>
  )
}

function MultiStepRequest({ lastProcessedAt, requests, requestStatus }) {
  return requests.map((request, index) => {
    const status = requestStatus[index]

    return (
      <RequestStepItem
        key={index}
        lastProcessedAt={lastProcessedAt}
        status={status}
        stepNumber={index + 1}
        request={request}
      />
    )
  })
}

function SingleRequest({ request, status }) {
  const theme = useTheme()

  const { iconColor, label } = useMemo(() => {
    if (status === REQUEST_STATUS_PROCESSING_FAILED) {
      return {
        iconColor: theme.negative,
        label: request.isTx ? 'Signing transaction failed!' : request.onError,
      }
    }

    if (status === REQUEST_STATUS_CONFIRMED) {
      return {
        iconColor: theme.positive,
        label: 'Transaction confirmed!',
      }
    }

    if (status === REQUEST_STATUS_PENDING) {
      return {
        iconColor: theme.info,
        label: 'Transaction being mined…',
      }
    }

    if (status === REQUEST_STATUS_PROCESSED) {
      return {
        iconColor: theme.positive,
        label: request.isTx ? 'Transaction signed!' : request.onSuccess,
      }
    }

    return {
      iconColor: theme.hint,
      label: request.isTx ? 'Waiting for signature…' : request.description,
    }
  }, [request, status, theme])

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${7.5 * GU}px;
          height: ${7.5 * GU}px;
          border: 2px solid ${iconColor};
          border-radius: 50%;
          transition: border-color 150ms ease-in-out;
        `}
      >
        {status === REQUEST_STATUS_PROCESSING_FAILED ? (
          <IconCross
            size="medium"
            css={`
              color: ${iconColor};
              transition: color 150ms ease-in-out;
            `}
          />
        ) : (
          <IconCheck
            size="medium"
            css={`
              color: ${iconColor};
              transition: color 150ms ease-in-out;
            `}
          />
        )}
      </div>
      <p
        css={`
          margin-top: ${3 * GU}px;
        `}
      >
        {label}
      </p>
    </div>
  )
}

function RequestStatusInfo({
  allSuccess,
  multipleRequests,
  maxAttemptsReached,
  onClosePanel,
  onNextAttempt,
  requests,
  requestStatus,
}) {
  const { activated } = useWallet()
  const provider = getProviderFromUseWalletId(activated)

  if (allSuccess) {
    return (
      <Info>Request{multipleRequests ? 's' : ''} processed successfully!</Info>
    )
  }

  const requiresMultipleSignatures =
    multipleRequests && requests.filter(request => request.isTx).length > 1
  const requestFailedStatus = requestStatus.find(status =>
    [REQUEST_STATUS_PROCESSING_FAILED, REQUEST_STATUS_FAILED].includes(status)
  )

  if (requestFailedStatus) {
    if (multipleRequests) {
      return (
        <RequestReattempt
          maxAttemptsReached={maxAttemptsReached}
          onClosePanel={onClosePanel}
          onNextAttempt={onNextAttempt}
        />
      )
    }

    return (
      <>
        <Info>
          {requestFailedStatus === REQUEST_STATUS_PROCESSING_FAILED
            ? "Your request wasn't processed correctly"
            : 'Your request failed'}
        </Info>
        <Button
          css={`
            margin-top: ${2 * GU}px;
          `}
          label="Close"
          mode="strong"
          onClick={onClosePanel}
          wide
        />
      </>
    )
  }

  if (multipleRequests) {
    return (
      <Info>
        {requiresMultipleSignatures ? (
          <span>
            This action requires multiple transactions. Please sign them one
            after another and <b>do not close this window</b> until the process
            is finished. Open your Ethereum provider {provider.name} to sign the
            transactions.{' '}
          </span>
        ) : (
          <span>
            This action requires multiple steps. Please,{' '}
            <b>do not close this window</b> until the process is finished.
          </span>
        )}
      </Info>
    )
  }

  // If we get here means we have only one request
  return (
    <Info>
      {requests[0].isTx
        ? `Open {provider.name} to sign your transaction`
        : requests[0].description}
    </Info>
  )
}

const RequestReattempt = ({
  maxAttemptsReached,
  onClosePanel,
  onNextAttempt,
}) => {
  return (
    <>
      <Info>
        {maxAttemptsReached
          ? `Seems that the request can't be processed`
          : `An error has occurred during the request process. Don't worry, you can
             try to process the request again.`}
      </Info>
      <Button
        css={`
          margin-top: ${2 * GU}px;
        `}
        label={maxAttemptsReached ? 'Close' : "OK, let's try again"}
        onClick={maxAttemptsReached ? onClosePanel : onNextAttempt}
        mode="strong"
        wide
      />
    </>
  )
}

export default RequestStatus

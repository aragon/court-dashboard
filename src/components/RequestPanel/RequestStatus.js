import React from 'react'
import { Button, GU, Info } from '@aragon/ui'
import RequestSteps from './Steps/RequestSteps'
import { useWallet } from '../../providers/Wallet'
import { getProviderFromUseWalletId } from '../../ethereum-providers'
import {
  REQUEST_STATUS_FAILED,
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
  const multipleRequests = requests.length > 1

  return (
    <div>
      <RequestSteps
        lastProcessedAt={lastProcessedAt}
        multipleRequests={multipleRequests}
        requests={requests}
        requestStatus={requestStatus}
      />
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
      <Info>Step{multipleRequests ? 's' : ''} processed successfully!</Info>
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
            ? "This step wasn't processed correctly"
            : 'This step failed'}
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
            These actions require multiple transactions. Please sign them one
            after another and <strong>do not close this window</strong> until
            all of them are finished. Open {provider.name} to sign the
            transactions.
          </span>
        ) : (
          <span>
            This action involves multiple steps. Please,{' '}
            <strong>do not close this window</strong> until all of them are
            finished.
          </span>
        )}
      </Info>
    )
  }

  // If we get here means we have only one request
  return (
    <Info>
      {requests[0].isTx
        ? `Open ${provider.name} to sign the transaction`
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
          ? `It seems there's something wrong with this step`
          : `An error occurred at this step. Don't worry, you can
             try to process this step again.`}
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

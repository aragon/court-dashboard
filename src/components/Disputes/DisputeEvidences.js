import React from 'react'
import { Accordion, GU, SyncIndicator, textStyle, useTheme } from '@aragon/ui'
import { useWallet } from 'use-wallet'

import ErrorLoadingEvidence from './ErrorLoadingEvidence'
import LocalIdentityBadge from '../LocalIdentityBadge/LocalIdentityBadge'
import Markdown from '../Markdown'
import useEvidences from '../../hooks/useEvidences'
import { addressesEqual } from '../../lib/web3-utils'
import { dateFormat } from '../../utils/date-utils'

import folderIcon from '../../assets/folderIcon.svg'

const DisputeEvidences = React.memo(function DisputeEvidences({ evidences }) {
  const evidenceProcessed = useEvidences(evidences)
  const evidencesFetching = evidenceProcessed.length < evidences.length

  return (
    <React.Fragment>
      <SyncIndicator visible={evidencesFetching} label="Loading evidences..." />
      {evidenceProcessed &&
        evidenceProcessed.map((evidence, index) => {
          const { createdAt, submitter, metadata, error } = evidence
          return (
            <Accordion
              key={index}
              items={[
                [
                  <div
                    css={`
                      display: flex;
                      align-items: center;
                    `}
                  >
                    <img src={folderIcon} width="17" height="20" alt="" />
                    <span
                      css={`
                        margin-left: ${1.5 * GU}px;
                      `}
                    >
                      Evidence #{index + 1}
                    </span>
                  </div>,
                  <EvidenceContent
                    metadata={metadata}
                    submitter={submitter}
                    createdAt={createdAt}
                    error={error}
                  />,
                ],
              ]}
            />
          )
        })}
    </React.Fragment>
  )
})

const EvidenceContent = React.memo(function EvidenceContent({
  metadata,
  submitter,
  createdAt,
  error,
}) {
  const theme = useTheme()
  const wallet = useWallet()

  if (error) {
    return <ErrorLoadingEvidence />
  }
  return (
    <div
      css={`
        margin-bottom: ${2 * GU}px;
        padding: ${3 * GU}px ${8 * GU}px;
      `}
    >
      <div
        css={`
          display: grid;
          grid-template-columns: 150px minmax(180px, auto);
          grid-gap: ${5 * GU}px;
          margin-bottom: ${5 * GU}px;
        `}
      >
        <div>
          <h2
            css={`
              ${textStyle('label2')};
              color: ${theme.surfaceContentSecondary};
              margin-bottom: ${2 * GU}px;
            `}
          >
            Submitted by
          </h2>
          <div
            css={`
              display: flex;
              align-items: flex-start;
            `}
          >
            <LocalIdentityBadge
              connectedAccount={addressesEqual(submitter, wallet.account)}
              entity={submitter}
            />
          </div>
        </div>
        <div>
          <h2
            css={`
              ${textStyle('label2')};
              color: ${theme.surfaceContentSecondary};
              margin-bottom: ${2 * GU}px;
            `}
          >
            Date
          </h2>
          <span
            css={`
              ${textStyle('body2')};
            `}
          >
            {dateFormat(createdAt, 'onlyDate')}
          </span>
        </div>
      </div>
      <div>
        <h2
          css={`
            ${textStyle('label2')};
            color: ${theme.surfaceContentSecondary};
            margin-bottom: ${2 * GU}px;
          `}
        >
          Data
        </h2>
        <div
          css={`
            display: flex;
            align-items: flex-start;
          `}
        >
          <Markdown text={metadata} />
        </div>
      </div>
    </div>
  )
})

export default DisputeEvidences

import React from 'react'
import resolvePathname from 'resolve-pathname'
import { GU, Link, textStyle, useTheme, useViewport } from '@aragon/ui'
import styled from 'styled-components'
import DisputeOutcomeText from './DisputeOutcomeText'
import IdentityBadge from '../IdentityBadge'
import { useWallet } from '../../providers/Wallet'
import { Phase as DisputePhase } from '../../types/dispute-status-types'
import { addressesEqual, transformAddresses } from '../../lib/web3-utils'
import { transformIPFSHash } from '../../lib/ipfs-utils'
import { IPFS_ENDPOINT } from '../../endpoints'

function DisputeInfoContent({ dispute, isFinalRulingEnsured }) {
  const { below } = useViewport()
  const compactMode = below('medium')

  const {
    agreementText,
    agreementUrl,
    disputedActionRadspec,
    disputedActionText,
    defendant,
    organization,
    plaintiff,
    subject,
  } = dispute

  const creator = plaintiff || subject?.id

  return (
    <>
      <Row compactMode={compactMode}>
        {disputedActionText ? (
          <Field
            label="Disputed Action"
            value={
              <DisputeActionText
                dispute={dispute}
                isFinalRulingEnsured={isFinalRulingEnsured}
              />
            }
          />
        ) : (
          <div />
        )}
        {organization && <Field label="Organization" value={organization} />}
      </Row>
      <Row compactMode={compactMode}>
        {disputedActionRadspec ? (
          <Field
            label="Description"
            value={disputedActionRadspec}
            css={`
              word-break: break-word;
              overflow-wrap: anywhere;
            `}
          />
        ) : (
          <div />
        )}
        {creator && <Field label="Plaintiff" value={creator} />}
      </Row>
      <Row compactMode={compactMode}>
        {agreementText ? (
          <Field
            label="Link to agreement"
            value={
              <Link external href={agreementUrl}>
                {agreementText}
              </Link>
            }
          />
        ) : (
          <div />
        )}
        {defendant && <Field label="Defendant" value={defendant} />}
      </Row>
    </>
  )
}

function Field({ label, value, ...props }) {
  const theme = useTheme()
  const wallet = useWallet()

  return (
    <div {...props}>
      <h2
        css={`
          ${textStyle('label2')};
          color: ${theme.surfaceContentSecondary};
          margin-bottom: ${1 * GU}px;
        `}
      >
        {label}
      </h2>

      {typeof value === 'string' ? (
        value.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {transformAddresses(line, (part, isAddress, index) =>
              isAddress ? (
                <span title={part} key={index}>
                  <IdentityBadge
                    connectedAccount={addressesEqual(part, wallet.account)}
                    compact
                    entity={part}
                  />
                </span>
              ) : (
                <React.Fragment key={index}>
                  {transformIPFSHash(part, (word, isIpfsHash, i) => {
                    if (isIpfsHash) {
                      const ipfsUrl = resolvePathname(
                        word,
                        `${IPFS_ENDPOINT}/${word}`
                      )
                      return (
                        <Link href={ipfsUrl} key={i}>
                          {word}
                        </Link>
                      )
                    }

                    return <span key={i}>{word}</span>
                  })}
                </React.Fragment>
              )
            )}
            <br />
          </React.Fragment>
        ))
      ) : (
        <div
          css={`
            ${textStyle('body2')};
          `}
        >
          {value}
        </div>
      )}
    </div>
  )
}

function DisputeActionText({ dispute, isFinalRulingEnsured }) {
  const { disputedActionText, disputedActionURL } = dispute
  const lastRound = dispute?.rounds?.[dispute.lastRoundId]
  const voteWinningOutcome = lastRound?.vote?.winningOutcome
  const appealedRuling = lastRound?.appeal?.appealedRuling

  if (!isFinalRulingEnsured) {
    return (
      <Link external href={disputedActionURL}>
        {disputedActionText}
      </Link>
    )
  }

  return (
    <DisputeOutcomeText
      action={disputedActionText}
      outcome={appealedRuling || voteWinningOutcome}
      phase={
        appealedRuling ? DisputePhase.AppealRuling : DisputePhase.RevealVote
      }
      verbose
    />
  )
}

const Row = styled.div`
  display: grid;

  ${({ compactMode }) => `
    grid-gap: ${(compactMode ? 2.5 : 5) * GU}px;
    margin-bottom: ${compactMode ? 0 : 2 * GU}px;
    grid-template-columns: ${
      compactMode ? 'auto' : `1fr minmax(${25 * GU}px, auto)`
    };
  `}
`

export default DisputeInfoContent

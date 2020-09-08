import React, { useEffect, useMemo, useState } from 'react'
import resolvePathname from 'resolve-pathname'
import { GU, Help, Link, textStyle, useTheme, useViewport } from '@aragon/ui'
import styled from 'styled-components'
import DisputeDetailDescription from './DisputeDetailDescription'
import DisputeOutcomeText from './DisputeOutcomeText'
import IdentityBadge from '../IdentityBadge'
import Loading from '../Loading'
import { useWallet } from '../../providers/Wallet'

import { describeDisputedAction } from '../../disputables'
import { IPFS_ENDPOINT } from '../../endpoints'
import { getIpfsCidFromUri, transformIPFSHash } from '../../lib/ipfs-utils'
import { addressesEqual, transformAddresses } from '../../lib/web3-utils'
import { Phase as DisputePhase } from '../../types/dispute-status-types'

function DisputeInfoContent({ dispute, isFinalRulingEnsured }) {
  const { below } = useViewport()
  const compactMode = below('medium')

  const {
    agreementText,
    agreementUrl,
    creator,
    defendant,
    description,
    disputedAction,
    disputedActionURL,
    executionPath,
    loading,
    organization,
  } = useDisputeFields(dispute)

  return (
    <>
      {isFinalRulingEnsured && (
        <Row>
          <FinalJuryOutcome dispute={dispute} />
        </Row>
      )}
      <Row compactMode={compactMode}>
        <DisputedAction
          actionText={disputedAction}
          dispute={dispute}
          executionPath={executionPath}
          isFinalRulingEnsured={isFinalRulingEnsured}
          loading={loading}
          url={disputedActionURL}
        />

        {organization && <Field label="Organization" value={organization} />}
      </Row>
      <Row compactMode={compactMode}>
        <Field
          label="Description"
          loading={loading}
          value={description}
          css={`
            word-break: break-word;
            overflow-wrap: anywhere;
          `}
        />
        {creator && <Field label="Plaintiff" value={creator} />}
      </Row>
      <Row compactMode={compactMode}>
        {agreementText ? (
          <Field
            label="Link to agreement"
            value={
              <Link
                external
                href={agreementUrl}
                css={`
                  text-decoration: none;
                `}
              >
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

function Field({ label, loading, value, ...props }) {
  const theme = useTheme()
  const wallet = useWallet()

  if (!value && !loading) {
    return <div />
  }

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
      {(() => {
        if (loading) {
          return <Loading size="small" center={false} />
        }

        if (typeof value === 'string') {
          const ipfsPath = getIpfsCidFromUri(value)
          if (ipfsPath) {
            const ipfsUrl = resolvePathname(ipfsPath, `${IPFS_ENDPOINT}/`)
            return (
              <Link
                href={ipfsUrl}
                css={`
                  text-decoration: none;
                `}
              >
                Read more
              </Link>
            )
          }

          return value.split('\n').map((line, i) => (
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
                          `${IPFS_ENDPOINT}/`
                        )
                        return (
                          <Link
                            href={ipfsUrl}
                            key={i}
                            css={`
                              text-decoration: none;
                            `}
                          >
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
        }

        return (
          <div
            css={`
              ${textStyle('body2')};
            `}
          >
            {value}
          </div>
        )
      })()}
    </div>
  )
}

function FinalJuryOutcome({ dispute }) {
  const { lastRoundId, rounds } = dispute
  const lastRound = rounds?.[lastRoundId]
  const voteWinningOutcome = lastRound?.vote?.winningOutcome
  const appealedRuling = lastRound?.appeal?.appealedRuling

  return (
    <Field
      label="Final Jury Outcome"
      value={
        <DisputeOutcomeText
          outcome={appealedRuling || voteWinningOutcome}
          phase={
            appealedRuling ? DisputePhase.AppealRuling : DisputePhase.RevealVote
          }
        />
      }
    />
  )
}

function DisputedAction({
  actionText,
  dispute,
  executionPath,
  isFinalRulingEnsured,
  loading,
  url,
}) {
  const ActionTextComponent = useMemo(() => {
    // Disputes may not include an embedded executable action
    if (!actionText && !loading) {
      return <DisputedActionNA />
    }

    const action = Array.isArray(executionPath) ? (
      <DisputeDetailDescription path={executionPath} />
    ) : (
      actionText
    )

    return url ? (
      <Link
        external
        href={url}
        css={`
          text-decoration: none;
          white-space: break-spaces;
          text-align: left;
        `}
      >
        {action}
      </Link>
    ) : (
      action
    )
  }, [actionText, executionPath, loading, url])

  return (
    <Field
      label="Disputed Action"
      loading={loading}
      value={ActionTextComponent}
      css={`
        word-break: break-word;
        overflow-wrap: anywhere;
      `}
    />
  )
}

function useDisputeFields(dispute) {
  const {
    agreementText,
    agreementUrl,
    defendant,
    disputable,
    organization,
    plaintiff,
    subject,
  } = dispute

  const creator = plaintiff || subject?.id

  const [
    {
      disputedActionRadspec,
      disputedActionText,
      disputedActionURL,
      executionPath,
    },
    loading,
  ] = useDisputedAction(dispute)

  const { disputedAction, description } = useMemo(() => {
    // Disputes created through agreements
    if (disputable) {
      return {
        disputedAction: disputedActionRadspec,
        description: disputable.actionContext,
      }
    }

    // Old disputes not created through agreements
    return {
      disputedAction: disputedActionText,
      description: disputedActionRadspec,
    }
  }, [disputable, disputedActionRadspec, disputedActionText])

  return {
    agreementText,
    agreementUrl,
    creator,
    defendant,
    description,
    disputable,
    disputedAction,
    disputedActionURL,
    executionPath,
    loading,
    organization,
  }
}

const DisputedActionNA = () => {
  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <span
        css={`
          margin-right: ${1 * GU}px;
        `}
      >
        N/A
      </span>
      <Help hint="">
        This dispute does not involve a binding action and is simply between the
        given context and arguments.
      </Help>
    </div>
  )
}

function useDisputedAction({
  id,
  disputable,
  disputedActionRadspec,
  disputedActionText,
  disputedActionURL,
  subject,
}) {
  const [disputedAction, setDisputedAction] = useState({
    disputedActionRadspec,
    disputedActionText,
    disputedActionURL,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // If the dispute was not created through an agreement, the disputed action
    // descriptions should be already available (initialized above)
    if (!disputable) {
      return
    }

    let cancelled = false
    setLoading(true)

    const describeDispute = async () => {
      // Get disputable long and short description
      // as well as the URL where the disputed action is taking place
      const disputedActionDescription = await describeDisputedAction(
        id,
        disputable.organization,
        disputable.address,
        disputable.disputableActionId,
        subject.id
      )

      if (!cancelled) {
        setLoading(false)
        setDisputedAction(disputedActionDescription)
      }
    }

    describeDispute()

    return () => {
      cancelled = true
    }
  }, [disputable, id, subject])

  return [disputedAction, loading]
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

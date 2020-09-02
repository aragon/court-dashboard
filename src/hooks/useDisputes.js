import { useEffect, useMemo, useState } from 'react'
import resolvePathname from 'resolve-pathname'
import { IPFS_ENDPOINT } from '../endpoints'
import { useCourtClock } from '../providers/CourtClock'
import { useCourtConfig } from '../providers/CourtConfig'
import {
  useSingleDisputeSubscription,
  useDisputesSubscription,
} from './subscription-hooks'
import { getPhaseAndTransition } from '../utils/dispute-utils'
import { ipfsGet, getIpfsCidFromUri } from '../lib/ipfs-utils'
import { convertToString, Status } from '../types/dispute-status-types'

const IPFS_ERROR_MSG = 'Error loading content from ipfs'

export default function useDisputes() {
  const courtConfig = useCourtConfig()
  const { currentTermId } = useCourtClock()
  const { disputes, fetching, error } = useDisputesSubscription()

  const disputesPhases = useMemo(() => {
    if (!disputes) {
      return null
    }

    return disputes.map(d =>
      getPhaseAndTransition(d, currentTermId, courtConfig)
    )
  }, [courtConfig, currentTermId, disputes])

  const disputesPhasesKey = disputesPhases
    ? disputesPhases.map(v => convertToString(Object.values(v)[0])).join('')
    : null

  return useMemo(() => {
    if (error) {
      return { error }
    }

    if (fetching) {
      return { fetching }
    }

    return {
      disputes: disputes.map((dispute, i) => {
        return {
          ...dispute,
          ...disputesPhases[i],
        }
      }),
    }
  }, [disputesPhases, disputes, disputesPhasesKey, error]) // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * Hook that processes a single dispute data
 * @param {String} disputeId Id of the dispute
 * @returns {Array} Array conformed by the dispute processed data, fetching indicator and an error object from the graph or an ipfs error in that order
 * (the error also indicates if the error is from the graph since we need to handle in a different way
 * in the dispute detail, the timeline can not be displayed if is a graph error but can if the error is from ipfs)
 */
export function useDispute(disputeId) {
  const courtConfig = useCourtConfig()
  const { currentTermId } = useCourtClock()
  const {
    dispute,
    fetching: graphFetching,
    error: graphError,
  } = useSingleDisputeSubscription(disputeId)

  const processedDispute = useProcessedDispute(dispute)
  const disputePhase = getPhaseAndTransition(
    dispute,
    currentTermId,
    courtConfig
  )
  const disputePhaseKey = disputePhase
    ? convertToString(Object.values(disputePhase)[0])
    : ''

  const graphErrorMessage = graphError?.message || ''
  const disputeErrorMessage = processedDispute?.error || graphErrorMessage

  return useMemo(
    () => {
      const fetching = graphFetching || (dispute && !processedDispute)

      return [
        dispute && processedDispute
          ? {
              ...processedDispute,
              ...disputePhase,
            }
          : null,
        fetching,
        disputeErrorMessage
          ? {
              message: disputeErrorMessage,
              fromGraph: Boolean(graphErrorMessage),
            }
          : null,
      ]
    } /* eslint-disable react-hooks/exhaustive-deps */,
    [
      disputeErrorMessage,
      disputePhaseKey,
      graphErrorMessage,
      graphFetching,
      processedDispute,
    ]
    /* eslint-enable react-hooks/exhaustive-deps */
  )
}

function useProcessedDispute(dispute) {
  const [processedDispute, setProcessedDispute] = useState(null)

  useEffect(() => {
    let cancelled = false

    const processDisputeData = async () => {
      if (dispute.status === Status.Voided) {
        return dispute
      }

      const disputeData = await getDisputeData(dispute)

      return {
        ...dispute,
        ...disputeData,
        error: disputeData ? null : IPFS_ERROR_MSG,
      }
    }

    const processDispute = async () => {
      if (!dispute) {
        return
      }

      const processedDispute = await processDisputeData()
      if (!cancelled) {
        setProcessedDispute(processedDispute)
      }
    }

    processDispute()

    return () => {
      cancelled = true
    }
  }, [dispute])

  return processedDispute
}

async function getDisputeData(dispute) {
  // Dispute is disputable
  if (dispute.disputable) {
    return processDisputableData(dispute)
  }

  // Dispute is raw dispute
  return processRawDisputeData(dispute)
}

async function processDisputableData(dispute) {
  const {
    agreement,
    defendant,
    plaintiff,
    organization,
    title,
  } = dispute.disputable

  const agreementIpfsCid = getIpfsCidFromUri(agreement)

  return {
    agreementText: title,
    agreementUrl: `${IPFS_ENDPOINT}/${agreementIpfsCid}`,
    defendant,
    description: title,
    organization,
    plaintiff,
  }
}

/**
 * Processes metadata for raw disputes. `metadataUri` contains the IPFS CID which will be fetched and parsed.
 * @param {*} dispute Dispute from which data will be processed.
 * @returns {Object | null} Dispute processed data.
 */
async function processRawDisputeData(dispute) {
  const { description: disputeDescription, metadataUri } = dispute

  if (metadataUri) {
    const ipfsPath = getIpfsCidFromUri(metadataUri)

    if (ipfsPath) {
      // Fetch IPFS content
      const { data, error } = await ipfsGet(ipfsPath)
      if (!error) {
        try {
          // Parse IPFS content
          const parsedDisputeData = JSON.parse(data)
          const agreementText = parsedDisputeData.agreementText.replace(
            /^.\//,
            ''
          )
          // Note that in this case, we expect the agreement's location to be relative to the
          // metadata URI. For example, if the metadataUri is `<cid>/metadata.json`, the agreement's
          // location would be `<cid>/<agreement>`
          const agreementUrl = agreementText
            ? resolvePathname(agreementText, `${IPFS_ENDPOINT}/${ipfsPath}`)
            : ''

          const {
            agreementTitle = '',
            defendant = '',
            description = disputeDescription,
            disputedActionRadspec = '',
            disputedActionText = '',
            disputedActionURL = '',
            organization = '',
            plaintiff = '',
          } = parsedDisputeData

          return {
            agreementText: agreementTitle || agreementText || '',
            agreementUrl,
            defendant,
            description,
            disputedActionRadspec,
            disputedActionText,
            disputedActionURL,
            organization,
            plaintiff,
          }
        } catch (err) {
          return {
            description: data,
          }
        }
      }
    }
  }
  return null
}

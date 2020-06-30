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
import { hexToAscii } from '../lib/web3-utils'

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
        const { description } = getDisputeInfo(dispute)
        return {
          ...dispute,
          description,
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

  const disputeProcessed = useProcessedDispute(dispute)
  const disputePhase = getPhaseAndTransition(
    dispute,
    currentTermId,
    courtConfig
  )
  const disputePhaseKey = disputePhase
    ? convertToString(Object.values(disputePhase)[0])
    : ''

  const graphErrorMessage = graphError?.message || ''
  const disputeErrorMessage = disputeProcessed?.error || graphErrorMessage

  return useMemo(
    () => {
      const fetching = graphFetching || (dispute && !disputeProcessed)

      return [
        dispute && disputeProcessed
          ? {
              ...disputeProcessed,
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
      disputeProcessed,
      graphErrorMessage,
      graphFetching,
    ]
    /* eslint-enable react-hooks/exhaustive-deps */
  )
}

function useProcessedDispute(dispute) {
  const [disputeProcessed, setDisputeProcessed] = useState(null)

  useEffect(() => {
    let cancelled = false

    const fetchDataFromIpfs = async () => {
      if (dispute.status === Status.Voided) {
        return dispute
      }

      const { dataUri, ...disputeInfo } = getDisputeInfo(dispute)

      if (dispute.disputable) {
        return {
          ...dispute,
          ...disputeInfo,
        }
      }

      if (dataUri) {
        const ipfsPath = getIpfsCidFromUri(dataUri)

        if (ipfsPath) {
          const { data, error } = await ipfsGet(ipfsPath)
          if (!error) {
            try {
              const parsedDisputeData = JSON.parse(data)
              const agreementText = parsedDisputeData.agreementText.replace(
                /^.\//,
                ''
              )
              const agreementUrl =
                agreementText &&
                resolvePathname(agreementText, `${IPFS_ENDPOINT}/${ipfsPath}`)

              return {
                ...dispute,
                description:
                  parsedDisputeData.description || disputeInfo.description,
                disputedActionText: parsedDisputeData.disputedActionText || '',
                disputedActionURL: parsedDisputeData.disputedActionURL || '',
                agreementText:
                  parsedDisputeData.agreementTitle || agreementText || '',
                agreementUrl: agreementUrl || '',
                disputedActionRadspec:
                  parsedDisputeData.disputedActionRadspec || '',
                organization: parsedDisputeData.organization || '',
                defendant: parsedDisputeData.defendant || '',
                plaintiff: parsedDisputeData.plaintiff || '',
                error: '',
              }
            } catch (err) {
              return {
                ...dispute,
                description: data,
              }
            }
          }
        }
      }

      return {
        ...dispute,
        error: IPFS_ERROR_MSG,
      }
    }

    const processDispute = async () => {
      if (!dispute) {
        return
      }

      const processedDispute = await fetchDataFromIpfs()
      if (!cancelled) {
        setDisputeProcessed(processedDispute)
      }
    }

    processDispute()

    return () => {
      cancelled = true
    }
  }, [dispute])

  return disputeProcessed
}

function getDisputeInfo(dispute) {
  // Dispute is agreement
  if (dispute.disputable) {
    const {
      // actionId,
      // address,
      agreement,
      defendant,
      // disputableActionId,
      plaintiff,
      organization,
      title,
    } = dispute.disputable

    const agreementIpfsCid = getIpfsCidFromUri(agreement)

    return {
      agreementUrl: `${IPFS_ENDPOINT}/${agreementIpfsCid}`,
      description: title,
      defendant,
      plaintiff,
      organization,
      agreementText: title,
    }
  }

  const decodedMetadata = hexToAscii(dispute.metadata)

  try {
    const { description, metadata } = JSON.parse(decodedMetadata)
    return { description, dataUri: metadata }
  } catch (error) {
    // if is not a json return the metadata as the description
    return { description: decodedMetadata }
  }
}

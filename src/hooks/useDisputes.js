import { useEffect, useMemo, useState } from 'react'
import resolvePathname from 'resolve-pathname'
import { IPFS_ENDPOINT } from '../endpoints'
import useNow from './useNow'
import { useCourtConfig } from '../providers/CourtConfig'
import {
  useSingleDisputeSubscription,
  useDisputesSubscription,
} from './subscription-hooks'
import { getPhaseAndTransition } from '../utils/dispute-utils'
import { convertToString, Status } from '../types/dispute-status-types'
import { ipfsGet, getIpfsCidFromUri } from '../lib/ipfs-utils'

const IPFS_ERROR_MSG = 'Error loading content from ipfs'

export default function useDisputes() {
  const courtConfig = useCourtConfig()
  const { disputes, fetching, error } = useDisputesSubscription()

  const now = useNow() // TODO: use court clock

  const disputesPhases = useMemo(() => {
    if (!disputes) {
      return null
    }

    return disputes.map(d => getPhaseAndTransition(d, courtConfig, now))
  }, [courtConfig, disputes, now])

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
        const [disputeDescription] = getDisputeInfoFromMetadata(
          dispute.metadata
        )
        return {
          ...dispute,
          description: disputeDescription,
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
  const now = useNow() // TODO: use court clock
  const {
    dispute,
    fetching: graphFetching,
    error: graphError,
  } = useSingleDisputeSubscription(disputeId)

  const disputeProcessed = useProcessedDispute(dispute)
  const disputePhase = getPhaseAndTransition(dispute, courtConfig, now)
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
    const fetchDataFromIpfs = async () => {
      if (!dispute) {
        return
      }
      if (dispute.status === Status.Voided) {
        return setDisputeProcessed(dispute)
      }

      const [disputeDescription, uriOrData] = getDisputeInfoFromMetadata(
        dispute.metadata
      )

      if (!uriOrData) {
        return setDisputeProcessed({
          ...dispute,
          error: IPFS_ERROR_MSG,
        })
      }

      const ipfsPath = getIpfsCidFromUri(uriOrData)

      if (ipfsPath) {
        const { data, error } = await ipfsGet(ipfsPath)
        if (error) {
          return setDisputeProcessed({
            ...dispute,
            error: IPFS_ERROR_MSG,
          })
        }
        try {
          const parsedDisputeData = JSON.parse(data)
          const agreementText = parsedDisputeData.agreementText.replace(
            /^.\//,
            ''
          )
          const agreementUrl =
            agreementText &&
            resolvePathname(agreementText, `${IPFS_ENDPOINT}/${ipfsPath}`)

          return setDisputeProcessed({
            ...dispute,
            description: parsedDisputeData.description || disputeDescription,
            disputedActionText: parsedDisputeData.disputedActionText || '',
            disputedActionURL: parsedDisputeData.disputedActionURL || '',
            agreementText: agreementText || '',
            agreementUrl: agreementUrl || '',
            disputedActionRadspec:
              parsedDisputeData.disputedActionRadspec || '',
            organization: parsedDisputeData.organization || '',
            defendant: parsedDisputeData.defendant || '',
            plaintiff: parsedDisputeData.plaintiff || '',
            error: '',
          })
        } catch (err) {
          return setDisputeProcessed({
            ...dispute,
            description: data,
          })
        }
      }
      return setDisputeProcessed({
        ...dispute,
        error: IPFS_ERROR_MSG,
      })
    }

    fetchDataFromIpfs()
  }, [dispute])

  return disputeProcessed
}

function getDisputeInfoFromMetadata(disputeMetadata) {
  try {
    const parsedDisputeData = JSON.parse(disputeMetadata)
    return [parsedDisputeData.description, parsedDisputeData.metadata]
  } catch (error) {
    // if is not a json return the metadata as the description
    return [disputeMetadata, null]
  }
}

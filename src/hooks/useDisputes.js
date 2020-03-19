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

const DISPUTE_PROCESSED_DEFAULT = {
  description: '',
  agreementText: '',
  defendant: '',
  plaintiff: '',
  error: false,
  fetching: true,
}
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

export function useDispute(disputeId) {
  const courtConfig = useCourtConfig()
  const now = useNow() // TODO: use court clock
  const { dispute, fetching } = useSingleDisputeSubscription(disputeId)
  const disputeProcessed = useProcessedDispute(dispute, fetching)

  const disputePhase = getPhaseAndTransition(dispute, courtConfig, now)
  const disputePhaseKey = disputePhase
    ? convertToString(Object.values(disputePhase)[0])
    : ''

  return useMemo(() => {
    return {
      dispute: {
        ...disputeProcessed,
        ...disputePhase,
      },
    }
  }, [disputeProcessed, disputePhaseKey]) // eslint-disable-line react-hooks/exhaustive-deps
}

function useProcessedDispute(dispute, fetching) {
  const [disputeProcessed, setDisputeProcessed] = useState(
    DISPUTE_PROCESSED_DEFAULT
  )

  useEffect(() => {
    const fetchDataFromIpfs = async () => {
      if (!dispute) {
        return setDisputeProcessed({ ...disputeProcessed, fetching })
      }
      if (dispute.status === Status.Voided) {
        return setDisputeProcessed({ ...dispute, fetching: false })
      }
      const [disputeDescription, uriOrData] = getDisputeInfoFromMetadata(
        dispute.metadata
      )

      if (!uriOrData) {
        return setDisputeProcessed({ ...dispute, fetching: false, error: true })
      }

      const ipfsPath = getIpfsCidFromUri(uriOrData)

      if (ipfsPath) {
        const { data, error } = await ipfsGet(ipfsPath)
        if (error) {
          return setDisputeProcessed({
            ...dispute,
            fetching: false,
            error: true,
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
            agreementText: agreementText || '',
            agreementUrl: agreementUrl || '',
            defendant: parsedDisputeData.defendant || '',
            plaintiff: parsedDisputeData.plaintiff || '',
            error: false,
            fetching: false,
          })
        } catch (err) {
          return setDisputeProcessed({
            ...dispute,
            description: data,
            fetching: false,
          })
        }
      }
      return setDisputeProcessed({ ...dispute, fetching: false, error: true })
    }

    fetchDataFromIpfs()
  }, [dispute]) // eslint-disable-line react-hooks/exhaustive-deps

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

import { useEffect, useMemo, useState } from 'react'
import resolvePathname from 'resolve-pathname'
import isIPFS from 'is-ipfs'
import { IPFS_ENDPOINT } from '../endpoints'
import useNow from './useNow'
import { useCourtConfig } from '../providers/CourtConfig'
import {
  useSingleDisputeSubscription,
  useDisputesSubscription,
} from './subscription-hooks'
import { getPhaseAndTransition } from '../utils/dispute-utils'
import { convertToString, Status } from '../types/dispute-status-types'
import { ipfsGet } from '../lib/ipfs-utils'

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
  const [disputeProcessed, setDisputeProcessed] = useState(null)
  const courtConfig = useCourtConfig()
  const now = useNow() // TODO: use court clock
  const { dispute, fetching } = useSingleDisputeSubscription(disputeId)

  useEffect(() => {
    const fetchDataFromIpfs = async () => {
      if (dispute) {
        if (dispute.status !== Status.Voided) {
          const [
            disputeDescription,
            disputeMetadata,
          ] = getDisputeInfoFromMetadata(dispute.metadata)

          if (!disputeMetadata) {
            return setDisputeProcessed({ ...dispute, error: true })
          }
          const ipfsPath = disputeMetadata.replace(/^ipfs:/, '')

          if (isIPFS.cidPath(ipfsPath)) {
            const { data, error } = await ipfsGet(ipfsPath)
            if (error) {
              return setDisputeProcessed({ ...dispute, error: true })
            }
            try {
              const parsedDisputeData = JSON.parse(data)
              const agreementText = parsedDisputeData.agreementText.replace(
                /^.\//,
                ''
              )
              const agreementUrl = resolvePathname(
                agreementText,
                `${IPFS_ENDPOINT}/${ipfsPath}`
              )
              return setDisputeProcessed({
                ...dispute,
                description:
                  parsedDisputeData.description || disputeDescription,
                agreementText: agreementText || '',
                agreementUrl,
                defendant: parsedDisputeData.defendant || '',
                plaintiff: parsedDisputeData.plaintiff || '',
                error: false,
              })
            } catch (err) {
              return setDisputeProcessed({ ...dispute, description: data })
            }
          }
          return setDisputeProcessed({ ...dispute, error: true })
        }

        return setDisputeProcessed({ ...dispute })
      }
    }

    fetchDataFromIpfs()
  }, [dispute])

  const disputePhase = getPhaseAndTransition(dispute, courtConfig, now)
  const disputePhaseKey = disputePhase
    ? convertToString(Object.values(disputePhase)[0])
    : ''

  return useMemo(() => {
    if (fetching || !disputeProcessed) {
      return { fetching: true }
    }

    return {
      dispute: {
        ...disputeProcessed,
        ...disputePhase,
      },
      fetching,
    }
  }, [disputeProcessed, dispute, disputePhaseKey]) // eslint-disable-line react-hooks/exhaustive-deps
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

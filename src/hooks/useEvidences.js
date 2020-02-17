import { useEffect, useState } from 'react'
import { ipfsGet, getIpfsCidFromString } from '../lib/ipfs-utils'
import { ERROR_TYPES } from '../types/evidences-status-types'

export default function useEvidences(evidences) {
  const [evidenceProcessed, setEvidenceProcessed] = useState([])
  const [evidenceCache, setEvidenceCache] = useState(new Map())

  useEffect(() => {
    let cancelled = false
    const appendEvidence = evidence => {
      if (cancelled) {
        return
      }
      setEvidenceProcessed(prev => {
        return [...prev, evidence].sort(
          ({ createdAt: dateLeft }, { createdAt: dateRight }) =>
            dateLeft - dateRight
        )
      })
    }

    evidences.forEach(async evidence => {
      const { data: evidenceData, submitter, createdAt, id } = evidence

      const ipfsCid = getIpfsCidFromString(evidenceData)

      // If is a valid CID try to fetch the content
      if (ipfsCid) {
        // If the cid was already processed exit
        if (evidenceCache.get(ipfsCid)) {
          return
        }

        const { data, error } = await ipfsGet(ipfsCid)

        if (error) {
          return appendEvidence({ error: ERROR_TYPES.ERROR_FETCHING_IPFS })
        }
        if (data) {
          setEvidenceCache(evidenceCache.set(evidenceCache, true))

          return appendEvidence({
            id,
            metadata: data || '',
            submitter,
            createdAt,
            error: false,
          })
        }
        // If the fetched data type is not one of the otherers return error
        return appendEvidence({
          error: ERROR_TYPES.ERROR_UNKNOWN_METADATA_TYPE,
        })
      }

      // If evidence metadata is not an ipfs cid return it as it is
      return appendEvidence({
        id,
        metadata: evidenceData,
        defendant: '',
        agreementText: '',
        submitter,
        createdAt,
        error: false,
      })
    })

    return () => {
      cancelled = true
    }
  }, [evidenceCache, evidences])

  return evidenceProcessed
}

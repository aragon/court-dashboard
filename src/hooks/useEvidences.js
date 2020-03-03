import isIPFS from 'is-ipfs'
import { useEffect, useState } from 'react'
import { ipfsGet } from '../lib/ipfs-utils'
import { dayjs } from '../utils/date-utils'
import { ERROR_TYPES } from '../types/evidences-status-types'

export default function useEvidences(evidences) {
  const [evidenceProcessed, setEvidenceProcessed] = useState([])

  useEffect(() => {
    let cancelled = false
    const appendEvidence = evidence => {
      if (cancelled) {
        return
      }

      setEvidenceProcessed(prev =>
        [
          ...prev,
          evidence,
        ].sort(({ createdAt: dateLeft }, { createdAt: dateRight }) =>
          dayjs(dateLeft).isAfter(dayjs(dateRight))
            ? 1
            : dayjs(dateLeft).isSame(dayjs(dateRight))
            ? 0
            : -1
        )
      )
    }

    evidences.forEach(async evidence => {
      const { data: evidenceData, submitter, createdAt } = evidence

      const ipfsHash = evidenceData.replace(/^ipfs:/, '')

      // check if the metadata inside the evidence is a cid
      // if the ipfs tag is not present return the metadata as plain string
      if (isIPFS.multihash(ipfsHash) || isIPFS.cid(ipfsHash)) {
        const { data, error } = await ipfsGet(ipfsHash)
        if (error) {
          return appendEvidence({ error: ERROR_TYPES.ERROR_FETCHING_IPFS })
        }
        if (data) {
          return appendEvidence({
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
  }, [evidences])

  return evidenceProcessed
}

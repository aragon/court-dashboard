import isIPFS from 'is-ipfs'
import { useEffect, useState } from 'react'
import { ipfsGet } from '../lib/ipfs-utils'
import dayjs from '../lib/dayjs'
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

      // check if the metadata inside the evidence is a cid
      if (isIPFS.multihash(evidenceData) || isIPFS.cid(evidenceData)) {
        const { data, error } = await ipfsGet(evidenceData)
        if (error) {
          return appendEvidence({ error: ERROR_TYPES.ERROR_FETCHING_IPFS })
        }
        if (data) {
          try {
            const parsedData = JSON.parse(data)
            // If the ipfs content is an object find the keys that we need
            if (parsedData.metadata) {
              return appendEvidence({
                metadata: parsedData.metadata || '',
                submitter,
                createdAt,
                error: false,
              })
            }
            // If the fetched data type is not one of the otherers return error
            return appendEvidence({
              error: ERROR_TYPES.ERROR_UNKNOWN_METADATA_TYPE,
            })
          } catch (err) {
            return appendEvidence({
              metadata: data,
              submitter,
              createdAt,
              error: false,
            })
          }
        }
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

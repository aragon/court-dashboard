import { useEffect, useState } from 'react'
import { ipfsGet } from '../lib/ipfs-utils'
import isIPFS from 'is-ipfs'
import { ERROR_TYPES } from '../types/evidences-status-types'

export default function useEvidences(evidences) {
  const [fetchedData, setFetchedData] = useState()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function getEvidenceData() {
      const evidenceFetchedData = await Promise.all(
        evidences.map(async evidence => {
          const { data: evidenceData, submitter, createdAt } = evidence

          // check if the metadata inside the evidence is a cid
          if (isIPFS.multihash(evidenceData) || isIPFS.cid(evidenceData)) {
            const { data, error } = await ipfsGet(evidenceData)
            if (!error) {
              if (typeof data === 'object') {
                // we are just interested in those keys
                return {
                  metadata: data.metadata || '',
                  defendant: data.defendant || '',
                  agreementText: data.agreementText || '',
                  submitter,
                  createdAt,
                  error: false,
                }
              }
              if (typeof data === 'string') {
                return {
                  metadata: data,
                  defendant: '',
                  agreementText: '',
                  submitter,
                  createdAt,
                  error: false,
                }
              }
              // If the fetched data type is not one of the otherers return error
              return { error: ERROR_TYPES.ERROR_UNKNOWN_METADATA_TYPE }
            }
            // If there was an error fetching the ipfs content return error
            return { error: ERROR_TYPES.ERROR_FETCHING_IPFS }
          }
          // If evidence metadata is not an ipfs cid return it as it is
          return {
            metadata: evidenceData,
            defendant: '',
            agreementText: '',
            submitter,
            createdAt,
            error: false,
          }
        })
      )

      setFetchedData(evidenceFetchedData)
      setLoading(false)
    }
    getEvidenceData()
  }, [evidences])

  return { fetchedData, loading }
}

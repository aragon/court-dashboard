import React, { useCallback, useMemo, useState } from 'react'
import { Header } from '@aragon/ui'
import MainButton from '../MainButton'
import DisputeDetail from './DisputeDetail'
import DisputeList from './DisputeList'
import { useQuery } from 'urql'

import { disputes } from '../../mock-data'

const disputesQuery = `
  query {
    disputes {
      id
      createTermId
      possibleRulings
      finalRuling
      lastRoundId
      state
      metadata
      createdAt
      subject {
        id
      }
    }
  }
`

function Disputes() {
  const [selectedDispute, selectDispute] = useSelectedDispute(disputes)
  const [res] = useQuery({
    query: disputesQuery,
  })

  if (res.fetching) {
    console.log('Loading...')
  } else if (res.error) {
    console.log(res.error)
  }

  console.log('RESSS ', res)

  const handleBack = useCallback(() => {
    selectDispute(-1)
  }, [selectDispute])

  return (
    <React.Fragment>
      <Header
        primary="Disputes"
        secondary={!selectedDispute && <MainButton label="Buy ANJ" />}
      />
      {selectedDispute ? (
        <DisputeDetail dispute={selectedDispute} onBack={handleBack} />
      ) : (
        <DisputeList
          disputes={disputes}
          selectDispute={selectDispute}
          // filteredDisputes={filteredDisputes}
          // disputeStatusFilter={disputeStatusFilter}
          // handleDisputeStatusFilterChange={handleDisputeStatusFilterChange}
          // disputeAppFilter={disputeAppFilter}
          // handleDisputeAppFilterChange={handleDisputeAppFilterChange}
          // handleClearFilters={handleClearFilters}
          // executionTargets={executionTargets}
        />
      )}
    </React.Fragment>
  )
}

const useSelectedDispute = disputes => {
  const [selectedDisputeId, setSelectedDisputeId] = useState(-1)

  const selectDispute = disputeId => setSelectedDisputeId(disputeId)

  const selectedDispute = useMemo(
    () => disputes.find(dispute => dispute.id === selectedDisputeId) || null,
    [disputes, selectedDisputeId]
  )

  return [selectedDispute, selectDispute]
}

export default Disputes

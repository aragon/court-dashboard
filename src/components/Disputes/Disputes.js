import React, { useCallback } from 'react'
import { Header, Button } from '@aragon/ui'

import DisputeDetail from './DisputeDetail'
import DisputeList from './DisputeList'

import { disputes } from '../../mock-data'

function Disputes({ selectDelay, selectedDispute }) {
  const handleBack = useCallback(() => {
    selectDelay(-1)
  }, [selectDelay])

  const selectDispute = disputeId =>
    console.log(`Selected dispute #${disputeId}`)

  return (
    <React.Fragment>
      <Header
        primary="Disputes"
        secondary={!selectedDispute && <Button label="Buy ANJ" />}
      />
      {selectedDispute ? (
        <DisputeDetail dispute={selectedDispute} onBack={handleBack} />
      ) : (
        <DisputeList
          disputes={disputes}
          selectDispute={selectDispute}
          // filteredDelays={filteredDelays}
          // delayStatusFilter={delayStatusFilter}
          // handleDelayStatusFilterChange={handleDelayStatusFilterChange}
          // delayAppFilter={delayAppFilter}
          // handleDelayAppFilterChange={handleDelayAppFilterChange}
          // handleClearFilters={handleClearFilters}
          // executionTargets={executionTargets}
        />
      )}
    </React.Fragment>
  )
}

export default Disputes

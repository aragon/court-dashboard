import React, { useState } from 'react'
import { Button, DropDown } from '@aragon/ui'
import { getDisputeLastRound } from '../../../utils/dispute-utils'
import { getAppealRulingOptions } from '../../../utils/crvoting-utils'

function AppealPanel({ dispute, onAppeal }) {
  const [selectedAppeal, setSelectedAppeal] = useState(-1)

  console.log('onAppeal', onAppeal)
  const lastRound = getDisputeLastRound(dispute)
  console.log(lastRound.vote.winningOutcome)
  const appealOptions = getAppealRulingOptions(lastRound.vote.winningOutcome)

  const handleAppeal = async event => {
    try {
      event.preventDefault()

      const appealOption = appealOptions[selectedAppeal]
      console.log(
        'calling with',
        dispute.id,
        dispute.lastRoundId,
        appealOption.outcome
      )

      const tx = await onAppeal(
        dispute.id,
        dispute.lastRoundId,
        appealOption.outcome
      )
      await tx.wait()
    } catch (err) {
      console.log('Error submitting tx: ', err)
    }
  }

  return (
    <form onSubmit={handleAppeal}>
      <DropDown
        items={appealOptions.map(option => option.description)}
        selected={selectedAppeal}
        onChange={setSelectedAppeal}
        wide
      />
      <Button type="submit" mode="strong" wide>
        Appeal ruling
      </Button>
    </form>
  )
}

export default AppealPanel

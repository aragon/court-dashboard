import React, { useState } from 'react'
import { Button, DropDown } from '@aragon/ui'

function AppealPanel({ dispute, onAppeal }) {
  const [selected, setSelected] = useState(0)

  // const dispute.appeal

  const handleAppeal = async event => {
    try {
      event.preventDefault()

      const lastRoundId = dispute.lastRoundId
      const tx = await onAppeal(dispute.id, lastRoundId, null)
      await tx.wait()
    } catch (err) {
      console.log('Error submitting tx: ', err)
    }
  }
  return (
    <form onSubmit={handleAppeal}>
      <DropDown items={[]} selected={selected} onChange={setSelected} />
      <Button type="submit" mode="strong" wide>
        Appeal ruling
      </Button>
    </form>
  )
}

export default AppealPanel

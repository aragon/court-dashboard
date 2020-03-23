import Jurors from '../data/Jurors'
import Disputes from '../data/Disputes'
import courtConfig from '../data/CourtConfig'

import { bigNum } from '../../lib/math-utils'
import { PCT_BASE } from '../../utils/dispute-utils'
import { accounts, getRandomNumber } from '../helper'

export default class {
  constructor() {
    this.config = courtConfig

    this.disputes = Disputes
    this.jurors = Jurors

    this.draftJurors()

    console.log('disputes', this.disputes)
  }

  getDispute(id) {
    return this.disputes.find(dispute => dispute.id === id)
  }

  getJuror(id) {
    return this.jurors.find(juror => juror.id === id)
  }

  draftJurors() {
    for (let i = 0; i < this.disputes.length; i++) {
      const dispute = this.disputes[i]
      console.log('Drafting for dispute', dispute, i)
      // We will only "draft" jurors for last round since we don't really care for previos rounds data
      const lastRoundId = dispute.rounds.length - 1
      const lastRound = dispute.rounds[lastRoundId]
      lastRound.jurors = []

      let selectedJurors = 0
      const jurorsNumber = lastRound.jurorsNumber
      while (selectedJurors < jurorsNumber) {
        console.log('entered while selectedJurors', selectedJurors)
        // We select a juror betwwen the 5 available accounts
        const selectedAccountIndex = getRandomNumber(0, accounts.length - 1)
        const selectedAccount = accounts[selectedAccountIndex]

        const selectedJuror = this.getJuror(selectedAccount)

        const jurorWeight = getRandomNumber(1, jurorsNumber - selectedJurors)
        const jurorDraft = {
          id: '0x',
          round: lastRound,
          juror: selectedJuror,
          weight: jurorWeight,
          locked: bigNum(this.config.minActiveBalance)
            .mul(this.config.penaltyPct)
            .div(PCT_BASE),
        }

        // We associate respective entities.
        // Note that we prevent storing circular references when setting null values
        // since they would error when querying them and we won't be using them anyways
        selectedJuror.drafts.push({ ...jurorDraft, juror: null })
        lastRound.jurors.push({
          ...jurorDraft,
          juror: { id: selectedJuror.id },
          round: null,
        })

        selectedJurors += jurorWeight
      }
    }
  }
}

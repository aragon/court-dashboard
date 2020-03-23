import courtConfig from './CourtConfig'

import { hash256 } from '../../lib/web3-utils'
import { dayjs } from '../../utils/date-utils'
import { DisputeState, AdjudicationState } from '../types'

const CREATE_TERM_ID = courtConfig.currentTerm
const PAST_DRAFT_TERM_ID = courtConfig.currentTerm - 4
const DRAFT_TERM_ID = CREATE_TERM_ID + 4

const ROUNDS = {
  FIRST_NOT_DRAFTED: {
    id: '0',
    state: AdjudicationState.Invalid,
    number: '0',
    draftTermId: DRAFT_TERM_ID,
    jurorsNumber: 0,
    settledPenalties: false,
    delayedTerms: 0,
    selectedJurors: 0,
    coherentJurors: 0,
    collectedTokens: 0,
    createdAt: 0,
    jurors: [],
    vote: null,
    appeal: null,
  },
  FIRST_DRAFTED_COMITTING_NO_VOTES_NO_APPEAL: {
    id: '0',
    state: AdjudicationState.Committing,
    number: '0',
    draftTermId: PAST_DRAFT_TERM_ID,
    jurorsNumber: 3,
    settledPenalties: false,
    jurorFees: courtConfig.jurorFee,
    delayedTerms: 3,
    selectedJurors: 3,
    coherentJurors: 0,
    collectedTokens: 0,
    createdAt: 0,
    vote: null,
    appeal: null,
  },
}

const DISPUTES_DATA = [
  {
    state: DisputeState.Ruled,
    metadata: 'Dispute finished',
    rounds: [{ ...ROUNDS.FIRST_DRAFTED_COMITTING_NO_VOTES_NO_APPEAL }],
  },
  {
    state: DisputeState.Adjudicating,
    metadata: 'Dispute appealed',
    rounds: [{ ...ROUNDS.FIRST_DRAFTED_COMITTING_NO_VOTES_NO_APPEAL }],
  },
  {
    state: DisputeState.Adjudicating,
    metadata: 'Dispute in last round',
    rounds: [{ ...ROUNDS.FIRST_DRAFTED_COMITTING_NO_VOTES_NO_APPEAL }],
  },
  {
    state: DisputeState.Adjudicating,
    metadata: 'Dispute in first adjudication round (jurors already drafted)',
    rounds: [{ ...ROUNDS.FIRST_DRAFTED_COMITTING_NO_VOTES_NO_APPEAL }],
  },
  {
    state: DisputeState.Evidence,
    metadata: 'Dispute in evidence submission',
    rounds: [{ ...ROUNDS.FIRST_NOT_DRAFTED }],
  },
]

function generateDisputes() {
  const disputes = []

  for (let i = 0; i < DISPUTES_DATA.length; i++) {
    const { state, metadata, rounds } = DISPUTES_DATA[i]

    const dispute = {
      id: String(i),
      txHash: hash256(i),
      createTermId: courtConfig.currentTerm,
      createdAt: dayjs().unix(),
      possibleRulings: 2,
      state,
      metadata,
      rounds,
      lastRoundId: rounds.length - 1,
    }

    disputes.unshift(dispute)
  }

  return disputes
}

// lastRoundId
// createdAt
// rounds {
//   id
//   state
//   number
//   draftTermId
//   jurorsNumber
//   settledPenalties
//   jurorFees
//   delayedTerms
//   selectedJurors
//   coherentJurors
//   collectedTokens
//   createdAt
//   jurors {
//     juror {
//       id
//     }
//     commitment
//     outcome
//   }
//   vote {
//     id
//     winningOutcome
//   }
//   appeal {
//     id
//     maker
//     appealedRuling
//     taker
//     opposedRuling
//     settled
//     createdAt
//   }
// }

export default generateDisputes()

import courtConfig from './CourtConfig'

import { hash256 } from '../../lib/web3-utils'
import { dayjs } from '../../utils/date-utils'
import {
  AdjudicationState,
  DisputeState,
  RulingOptions,
  getRulingOptionNumber,
} from '../types'

const DEFAULT_IPFS_METADATA =
  'QmPWJBAvLqdv5oNv7WvEFaghiMkWtcThDRJGFKu6kennpF/metadata.json'
const CREATE_TERM_ID = courtConfig.currentTerm
const DRAFT_TERM_ID = CREATE_TERM_ID + 4

const ROUNDS = {
  // Mock round to use for multi-round disputes
  PREVIOUS: {
    id: '0',
    state: AdjudicationState.Ended,
    draftTermId: '50', // TODO: Find better calculation
    createdAt: 0,
    delayedTerms: 0,
    jurors: [],

    // We'll create "mock" votes and appeals for previous rounds
    // Note that these won't be considered for appeal collaterals or other accountable data
    vote: {
      winningOutcome: getRulingOptionNumber(RulingOptions.Against),
    },
    appeal: {
      appealedRuling: getRulingOptionNumber(RulingOptions.InFavor),
      createdAt: dayjs().unix(),
      opposedRuling: getRulingOptionNumber(RulingOptions.Against),
      confirmedAt: dayjs().unix(),
    },
  },

  // Round not drafted
  NOT_DRAFTED: {
    id: '0',
    state: AdjudicationState.Invalid,
    draftTermId: DRAFT_TERM_ID,
    jurorsNumber: 0,
    settledPenalties: false,
    delayedTerms: 0,
    selectedJurors: 0,
    coherentJurors: 0,
    collectedTokens: 0,
    createdAt: 0,
  },

  // Round in comitting phase
  COMITTING: {
    id: '0',
    state: AdjudicationState.Committing,
    jurorsNumber: courtConfig.firstRoundJurorsNumber,
    settledPenalties: false,
    jurorFees: courtConfig.jurorFee,
    delayedTerms: 0,
    selectedJurors: 3,
    coherentJurors: 0,
    collectedTokens: 0,
    createdAt: 0,
  },

  // Round has been appealed
  APPEALED: {
    id: '0',
    state: AdjudicationState.ConfirmingAppeal,
    jurorsNumber: courtConfig.firstRoundJurorsNumber,
    settledPenalties: false,
    jurorFees: courtConfig.jurorFee,
    delayedTerms: 0,
    selectedJurors: 3,
    coherentJurors: 0,
    collectedTokens: 0,
    createdAt: 0,
  },

  // Round has been confirm appealed
  CONFIRM_APPEALED: {
    id: '0',
    state: AdjudicationState.Invalid,
    jurorsNumber:
      courtConfig.firstRoundJurorsNumber * courtConfig.appealStepFactor,
    settledPenalties: false,
    jurorFees: courtConfig.jurorFee,
    delayedTerms: 0,
    selectedJurors: 3,
    coherentJurors: 0,
    collectedTokens: 0,
    createdAt: 0,
  },

  // Round ended
  ENDED: {
    id: '0',
    state: AdjudicationState.Ended,
    jurorsNumber: courtConfig.firstRoundJurorsNumber,
    settledPenalties: false,
    jurorFees: courtConfig.jurorFee,
    delayedTerms: 0,
    selectedJurors: 3,
    coherentJurors: 0,
    collectedTokens: 0,
    createdAt: 0,
  },
}

// Data that tells the state of each dispute
const DISPUTES_DATA = [
  {
    state: DisputeState.Ruled,
    metadata: JSON.stringify({
      description: 'Dispute finished (First round, In favor unanimous)',
      metadata: DEFAULT_IPFS_METADATA,
    }),
    rounds: [{ ...ROUNDS.ENDED }],
    flagData: {
      vote: {
        winningOutcome: RulingOptions.InFavor,
      },
    },
  },
  {
    state: DisputeState.Ruled,
    metadata: JSON.stringify({
      description: 'Dispute finished (First round, No one voted)',
      metadata: DEFAULT_IPFS_METADATA,
    }),
    rounds: [{ ...ROUNDS.ENDED }],
  },
  {
    state: DisputeState.Ruled,
    metadata: JSON.stringify({
      description: 'Dispute finished (Last round)',
      metadata: DEFAULT_IPFS_METADATA,
    }),
    rounds: [
      ...populatePreviousRounds(courtConfig.maxRegularAppealRounds),
      { ...ROUNDS.ENDED },
    ],
    flagData: {
      vote: {
        winningOutcome: RulingOptions.Against,
      },
    },
  },
  {
    state: DisputeState.Drafting,
    metadata: JSON.stringify({
      description: 'Dispute confirm appealed',
      metadata: DEFAULT_IPFS_METADATA,
    }),
    rounds: [{ ...ROUNDS.PREVIOUS }, { ...ROUNDS.CONFIRM_APPEALED }],
  },
  {
    state: DisputeState.Adjudicating,
    metadata: JSON.stringify({
      description: 'Dispute appealed',
      metadata: DEFAULT_IPFS_METADATA,
    }),
    rounds: [{ ...ROUNDS.APPEALED }],
    flagData: {
      vote: {
        winningOutcome: RulingOptions.Against,
      },
      appeal: {
        appealedRuling: RulingOptions.InFavor,
      },
    },
  },
  {
    state: DisputeState.Adjudicating,
    metadata: JSON.stringify({
      description:
        'Dispute in first adjudication round (jurors already drafted)',
      metadata: DEFAULT_IPFS_METADATA,
    }),
    rounds: [{ ...ROUNDS.COMITTING }],
  },
  {
    state: DisputeState.Evidence,
    metadata: JSON.stringify({
      description: 'Dispute in evidence submission',
      metadata: DEFAULT_IPFS_METADATA,
    }),
    rounds: [{ ...ROUNDS.NOT_DRAFTED }],
  },
]

function populatePreviousRounds(numberOfRounds) {
  return Array.from({ length: numberOfRounds }).map(_ => ({
    ...ROUNDS.PREVIOUS,
  }))
}

function generateDisputes() {
  const disputes = []

  for (let i = 0; i < DISPUTES_DATA.length; i++) {
    const { flagData, metadata, rounds, state } = DISPUTES_DATA[i]

    const disputeId = String(i)
    const dispute = {
      id: disputeId,
      txHash: hash256(i),
      createTermId: courtConfig.currentTerm,
      createdAt: dayjs().unix(),
      possibleRulings: 2,
      state,
      metadata,
      rounds: rounds.map((round, index) => ({
        ...round,
        number: String(index),
        dispute: {
          id: disputeId,
          rounds: rounds.map(round => ({ id: round.id })),
        },
      })),
      lastRoundId: rounds.length - 1,
      flagData,
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

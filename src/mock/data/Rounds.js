import courtConfig from './CourtConfig'
import { AdjudicationState, RulingOptions } from '../types'

const DEFAULT_ROUND_DATA = {
  id: '0',
  coherentJurors: 0,
  collectedTokens: '0',
  createdAt: 0,
  delayedTerms: 0,
  jurorFees: '0',
  settledPenalties: false,
}

const ROUNDS = {
  // Mock round to use for multi-round disputes
  PREVIOUS: {
    state: AdjudicationState.Ended,
    draftTermId: '50', // TODO: Find better calculation

    // We'll create "mock" votes and appeals for previous rounds
    voteData: {
      winningOutcome: RulingOptions.Against,
    },

    appealData: {
      appealedRuling: RulingOptions.InFavor,
      opposedRuling: RulingOptions.Against,
    },
    ...DEFAULT_ROUND_DATA,
  },

  // Round not drafted
  NOT_DRAFTED: {
    state: AdjudicationState.Invalid,
    jurorsNumber: 0,
    ...DEFAULT_ROUND_DATA,
  },

  // Round in comitting phase
  COMITTING: {
    state: AdjudicationState.Committing,
    jurorsNumber: courtConfig.firstRoundJurorsNumber,
    ...DEFAULT_ROUND_DATA,
  },

  // Round in revealing phase
  REVEALING: {
    state: AdjudicationState.Revealing,
    jurorsNumber: courtConfig.firstRoundJurorsNumber,
    voteData: {
      onlyCommit: true,
    },
    ...DEFAULT_ROUND_DATA,
  },

  // Round in appealing phase
  APPEALING: {
    state: AdjudicationState.Appealing,
    jurorsNumber: courtConfig.firstRoundJurorsNumber,
    voteData: {
      winningOutcome: RulingOptions.Against,
      minority: RulingOptions.InFavor,
    },
    ...DEFAULT_ROUND_DATA,
  },

  // Round has been appealed (in confirm appeal phase)
  APPEALED: {
    state: AdjudicationState.ConfirmingAppeal,
    jurorsNumber: courtConfig.firstRoundJurorsNumber,
    voteData: {
      winningOutcome: RulingOptions.Against,
      minority: RulingOptions.InFavor,
    },
    appealData: {
      appealedRuling: RulingOptions.InFavor,
    },
    ...DEFAULT_ROUND_DATA,
  },

  // Round has been confirm appealed
  CONFIRM_APPEALED: {
    state: AdjudicationState.Invalid,
    jurorsNumber:
      courtConfig.firstRoundJurorsNumber * courtConfig.appealStepFactor,
    ...DEFAULT_ROUND_DATA,
  },

  // Round ended In favor
  ENDED: {
    IN_FAVOR: {
      state: AdjudicationState.Ended,
      jurorsNumber: courtConfig.firstRoundJurorsNumber,
      voteData: {
        winningOutcome: RulingOptions.InFavor,
        minority: RulingOptions.Against,
      },
      ...DEFAULT_ROUND_DATA,
    },

    // Round ended and Refused
    REFUSED: {
      state: AdjudicationState.Ended,
      jurorsNumber: courtConfig.firstRoundJurorsNumber,
      voteData: {
        winningOutcome: RulingOptions.Refused,
        minority: RulingOptions.InFavor,
      },
      settlePenalties: true,
      ...DEFAULT_ROUND_DATA,
    },

    NO_VOTES: {
      state: AdjudicationState.Ended,
      jurorsNumber: courtConfig.firstRoundJurorsNumber,
      ...DEFAULT_ROUND_DATA,
    },

    FINAL_ROUND: {
      state: AdjudicationState.Ended,
      voteData: {
        winningOutcome: RulingOptions.Against,
        minority: RulingOptions.InFavor,
      },
      // settlePenalties: true,
      ...DEFAULT_ROUND_DATA,
    },
  },
}

export default ROUNDS

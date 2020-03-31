import { getNetwork } from '../../networks'
import { bigExp } from '../helper'
import dayjs from 'dayjs'

const TERM_DURATION = 60 // 1 minutes
const CURRENT_TERM = 100
const COURT_START = dayjs() // Court started 100 terms ago
  .subtract(TERM_DURATION * CURRENT_TERM, 'second')
  .unix()

const anjToken = {
  id: '',
  name: 'Aragon Network Juror Token',
  symbol: 'ANJ',
  decimals: 18,
}

const feeToken = {
  id: '',
  name: 'Dai stablecoin',
  symbol: 'DAI',
  decimals: 18,
}

const courtConfig = {
  id: getNetwork().court,
  currentTerm: CURRENT_TERM,
  termDuration: TERM_DURATION, // 4 minutes
  anjToken,
  feeToken,
  jurorFee: bigExp('10'),
  draftFee: bigExp('18', 16),
  settleFee: bigExp('1', 17),
  evidenceTerms: 21,
  commitTerms: '3',
  revealTerms: '3',
  appealTerms: '3',
  appealConfirmationTerms: '3',
  terms: [
    {
      startTime: COURT_START,
    },
  ],
  finalRoundReduction: '5000',
  firstRoundJurorsNumber: '3',
  appealStepFactor: '3',
  maxRegularAppealRounds: '2',
  appealCollateralFactor: '30000',
  appealConfirmCollateralFactor: '20000',
  minActiveBalance: bigExp('100'),
  penaltyPct: '1000',
  modules: [
    // type
    // address
  ],
  subscriptions: {
    currentPeriod: '0',
    feeAmount: bigExp('10'),
    periodDuration: '600',
    periods: [],
  },
}

export default courtConfig

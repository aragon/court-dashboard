import { getCourtAddress } from '../../networks'
import { bigExp } from '../helper'
import dayjs from 'dayjs'

const TERM_DURATION = 240 // 4 minutes
const CURRENT_TERM = 10
const COURT_START = dayjs() // Court started 10 terms ago
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
  id: getCourtAddress(),
  currentTerm: CURRENT_TERM,
  termDuration: TERM_DURATION, // 4 minutes
  anjToken,
  feeToken,
  jurorFee: bigExp('10'),
  draftFee: bigExp('18', 16),
  settleFee: bigExp('1', 17),
  evidenceTerms: 21,
  commitTerms: '6',
  revealTerms: '6',
  appealTerms: '6',
  appealConfirmationTerms: '6',
  terms: [
    {
      startTime: COURT_START,
    },
  ],
  finalRoundReduction: '5000',
  firstRoundJurorsNumber: '3',
  appealStepFactor: '3',
  maxRegularAppealRounds: '3',
  appealCollateralFactor: '30000',
  appealConfirmCollateralFactor: '20000',
  minActiveBalance: bigExp('100'),
  penaltyPct: '1000',
  modules: [
    // type
    // address
  ],
}

export default courtConfig

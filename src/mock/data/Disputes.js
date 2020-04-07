import courtConfig from './CourtConfig'
import ROUNDS from './Rounds'
import { hash256 } from '../../lib/web3-utils'
import { dayjs } from '../../utils/date-utils'
import { DisputeState } from '../types'

const DEFAULT_IPFS_METADATA =
  'QmPWJBAvLqdv5oNv7WvEFaghiMkWtcThDRJGFKu6kennpF/metadata.json'

// Data that tells the state of each dispute
const DISPUTES_DATA = [
  {
    state: DisputeState.Ruled,
    metadata: JSON.stringify({
      description: 'Dispute finished (First round, In favor)',
      metadata: DEFAULT_IPFS_METADATA,
    }),
    rounds: [{ ...ROUNDS.ENDED.IN_FAVOR }],
  },
  {
    state: DisputeState.Ruled,
    metadata: JSON.stringify({
      description:
        'Dispute finished (First round, Refused to vote, Penalties Settled)',
      metadata: DEFAULT_IPFS_METADATA,
    }),
    rounds: [{ ...ROUNDS.ENDED.REFUSED }],
  },
  {
    state: DisputeState.Ruled,
    metadata: JSON.stringify({
      description: 'Dispute finished (First round, No one voted)',
      metadata: DEFAULT_IPFS_METADATA,
    }),
    rounds: [{ ...ROUNDS.ENDED.NO_VOTES }],
  },
  {
    state: DisputeState.Ruled,
    metadata: JSON.stringify({
      description: 'Dispute finished (Final round, Against)',
      metadata: DEFAULT_IPFS_METADATA,
    }),
    rounds: [
      ...populatePreviousRounds(courtConfig.maxRegularAppealRounds),
      { ...ROUNDS.ENDED.FINAL_ROUND },
    ],
  },
  {
    state: DisputeState.Adjudicating,
    metadata: JSON.stringify({
      description: 'Dispute finished (Execute ruling)',
      metadata: DEFAULT_IPFS_METADATA,
    }),
    rounds: [{ ...ROUNDS.ENDED.IN_FAVOR }],
  },
  {
    state: DisputeState.Drafting,
    metadata: JSON.stringify({
      description: 'Dispute confirm appealed',
      metadata: DEFAULT_IPFS_METADATA,
    }),
    rounds: [populatePreviousRounds(1), { ...ROUNDS.CONFIRM_APPEALED }],
  },
  {
    state: DisputeState.Adjudicating,
    metadata: JSON.stringify({
      description: 'Dispute appealed',
      metadata: DEFAULT_IPFS_METADATA,
    }),
    rounds: [{ ...ROUNDS.APPEALED }],
  },
  {
    state: DisputeState.Adjudicating,
    metadata: JSON.stringify({
      description: 'Dispute appealing',
      metadata: DEFAULT_IPFS_METADATA,
    }),
    rounds: [{ ...ROUNDS.APPEALING }],
  },
  {
    state: DisputeState.Adjudicating,
    metadata: JSON.stringify({
      description: 'Dispute revealing',
      metadata: DEFAULT_IPFS_METADATA,
    }),
    rounds: [{ ...ROUNDS.REVEALING }],
  },
  {
    state: DisputeState.Adjudicating,
    metadata: JSON.stringify({
      description: 'Dispute comitting',
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
  return Array.from({ length: numberOfRounds }).map((_, index) => ({
    ...ROUNDS.PREVIOUS,
    jurorsNumber: courtConfig.appealStepFactor ** (index + 1),
  }))
}

function generateDisputes() {
  const disputes = []

  for (let i = 0; i < DISPUTES_DATA.length; i++) {
    const { metadata, rounds, state } = DISPUTES_DATA[i]

    const disputeId = String(i)
    const dispute = {
      id: disputeId,
      txHash: hash256(i),
      createTermId: courtConfig.currentTerm,
      createdAt: dayjs().unix(),
      possibleRulings: 2,
      state,
      metadata,
      lastRoundId: rounds.length - 1,
    }

    dispute.rounds = rounds.map((round, index) => ({
      ...round,
      number: String(index),
      dispute,
    }))

    disputes.unshift(dispute)
  }

  return disputes
}

export default generateDisputes()

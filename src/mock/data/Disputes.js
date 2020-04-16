import courtConfig from './CourtConfig'
import ROUNDS from './Rounds'
import { hash256 } from '../../lib/web3-utils'
import { dayjs } from '../../utils/date-utils'
import { DisputeState } from '../types'
import { accounts } from '../helper'

const DEFAULT_SUBMITTER = accounts[5]
const DEFAULT_EVIDENCE =
  '0x697066733a516d55765a53545a3958767156786b624446664a576e6644394759703376376d71353778464d563173774e34314c'
const DEFAULT_IPFS_METADATA =
  'QmPWJBAvLqdv5oNv7WvEFaghiMkWtcThDRJGFKu6kennpF/metadata.json'

// State of each dispute
const DISPUTES_DATA = [
  {
    state: DisputeState.Ruled,
    description: 'Dispute finished (First round, In favor)',
    rounds: [{ ...ROUNDS.ENDED.IN_FAVOR }],
  },
  {
    state: DisputeState.Ruled,
    description:
      'Dispute finished (First round, Refused to vote, Penalties Settled)',
    rounds: [{ ...ROUNDS.ENDED.REFUSED }],
  },
  {
    state: DisputeState.Ruled,
    description: 'Dispute finished (First round, No one voted)',
    rounds: [{ ...ROUNDS.ENDED.NO_VOTES }],
  },
  {
    state: DisputeState.Ruled,
    description: 'Dispute finished (Final round, Against)',
    rounds: [
      ...populatePreviousRounds(courtConfig.maxRegularAppealRounds),
      { ...ROUNDS.ENDED.FINAL_ROUND },
    ],
  },
  {
    state: DisputeState.Adjudicating,
    description: 'Dispute finished (Execute ruling)',
    rounds: [{ ...ROUNDS.ENDED.IN_FAVOR }],
  },
  {
    state: DisputeState.Drafting,
    description: 'Dispute confirm appealed',
    rounds: [populatePreviousRounds(1), { ...ROUNDS.CONFIRM_APPEALED }],
  },
  {
    state: DisputeState.Adjudicating,
    description: 'Dispute appealed',
    rounds: [{ ...ROUNDS.APPEALED }],
  },
  {
    state: DisputeState.Adjudicating,
    description: 'Dispute appealing',
    rounds: [{ ...ROUNDS.APPEALING }],
  },
  {
    state: DisputeState.Adjudicating,
    description: 'Dispute revealing',
    rounds: [{ ...ROUNDS.REVEALING }],
  },
  {
    state: DisputeState.Adjudicating,
    description: 'Dispute comitting',
    rounds: [{ ...ROUNDS.COMITTING }],
  },
  {
    state: DisputeState.Evidence,
    description: 'Dispute in evidence submission',
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
    const { description, rounds, state } = DISPUTES_DATA[i]

    const disputeId = String(i)
    const dispute = {
      id: disputeId,
      txHash: hash256(i),
      createTermId: courtConfig.currentTerm,
      createdAt: dayjs().unix(),
      possibleRulings: 2,
      state,
      metadata: JSON.stringify({
        description,
        metadata: DEFAULT_IPFS_METADATA,
      }),
      lastRoundId: rounds.length - 1,
      evidences: [
        {
          submitter: DEFAULT_SUBMITTER,
          data: DEFAULT_EVIDENCE,
          createdAt: dayjs().unix(),
        },
      ],
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

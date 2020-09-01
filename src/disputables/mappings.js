// Disputable apps extractors
import {
  dandelionVotingExtractor,
  delayExtractor,
  votingExtractor,
} from './scriptExtractors'
import {
  DANDELION_VOTING_APP_IDS,
  DELAY_APP_IDS,
  VOTING_APP_IDS,
} from './known-appIds'

const disputableVotingAction = {
  entityPath: 'vote',
  scriptExtractor: votingExtractor,
}

const disputableDandelionAction = {
  entityPath: 'vote',
  scriptExtractor: dandelionVotingExtractor,
}

const disputableDelayAction = {
  entityPath: 'delay',
  scriptExtractor: delayExtractor,
}

// Mapping of all disputable apps appId to their
// corresponding method for describing a disputed action.
// TODO: Add Conviction Voting
export const DISPUTABLE_ACTIONS = new Map([
  ...DANDELION_VOTING_APP_IDS.map(appId => [appId, disputableDandelionAction]),
  ...DELAY_APP_IDS.map(appId => [appId, disputableDelayAction]),
  ...VOTING_APP_IDS.map(appId => [appId, disputableVotingAction]),
])

// Mapping of all disputable apps appId to their
// corresponding subgraph name
export const DISPUTABLE_SUBGRAPH_NAMES = new Map([
  ...VOTING_APP_IDS.map(appId => [appId, 'aragon-dvoting']),
])

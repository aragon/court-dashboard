// Disputable apps extractors
import {
  dandelionVotingExtractor,
  delayExtractor,
  votingExtractor,
} from './scriptExtractors'

// Disputable appIds
const DANDELION_VOTING_APP_IDS = [
  '0x0a85f166c21ad90fc107023e825457adfa137ef94f52f4f695ec00023bd05742', // disputable-dandelion-voting.aragonpm.eth
]
const DELAY_APP_IDS = [
  '0x133c97c74d2197a068988549d31108ce57af8f0ccf90ff9edf0ba5d349f2a450', // disputable-delay.aragonpm.eth
]
const VOTING_APP_IDS = [
  '0x09cdc3e6887a0002b11992e954a40326a511a1750a2f5c69d17b8b660b0d337a', // disputable-voting.aragonpm.eth
  '0x705b5084c67966bb8e4640b28bab7a1e51e03d209d84e3a04d2a4f7415f93b34', // disputable-voting.open.aragonpm.eth
  '0x39aa9e500efe56efda203714d12c78959ecbf71223162614ab5b56eaba014145', // disputable-voting.precedence-campaign.aragonpm.eth
]

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

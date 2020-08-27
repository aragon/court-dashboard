import environment from '../environment'
import { getContract } from '../web3-contracts'
import { performQuery, disputableVotingQuery } from './queries'
import { sanitizeNetworkType, getNetworkType } from '../lib/web3-utils'

import disputableDandelionVotingAbi from '../abi/disputables/DisputableDandelionVoting.json'
import disputableDelayAbi from '../abi/disputables/DisputableDelay.json'

const SUBGRAPH_NAME = environment('SUBGRAPH_NAME')

export function delayExtractor(disputableAddress, disputableActionId) {
  return extractFromContract(
    disputableDelayAbi,
    disputableAddress,
    disputableActionId,
    'delayedScripts',
    4
  )
}

export function dandelionVotingExtractor(
  disputableAddress,
  disputableActionId
) {
  return extractFromContract(
    disputableDandelionVotingAbi,
    disputableAddress,
    disputableActionId,
    'getVote',
    10
  )
}

export async function votingExtractor(disputableAddress, disputableActionId) {
  // Disputable voting now saves the hash of the evmScript so we need to get it from the subgraph.
  const networkType = sanitizeNetworkType(getNetworkType())
  const subgraphUrl = `https://api.thegraph.com/subgraphs/name/aragon/aragon-dvoting-${networkType}${
    SUBGRAPH_NAME ? `-${SUBGRAPH_NAME}` : ''
  }`

  const { data } = await performQuery(subgraphUrl, disputableVotingQuery, {
    id: disputableAddress,
    voteId: disputableActionId,
  })

  if (!data?.disputableVoting?.votes?.length) {
    throw new Error('Failed to fetch evmScript from subgraph')
  }

  return data.disputableVoting.votes[0].script
}

async function extractFromContract(
  abi,
  disputableAddress,
  disputableActionId,
  fn,
  scriptPosition
) {
  const disputableAppContract = getContract(disputableAddress, abi)

  // Fetch the evmScript via contract call
  const result = await disputableAppContract[fn](disputableActionId)
  return result[scriptPosition]
}

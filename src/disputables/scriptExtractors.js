import { getContract } from '../web3-contracts'
import { performDisputableVotingQuery } from './queries'

import disputableDandelionVotingAbi from '../abi/disputables/DisputableDandelionVoting.json'
import disputableDelayAbi from '../abi/disputables/DisputableDelay.json'

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

export async function votingExtractor(
  disputableAddress,
  disputableActionId,
  disputableAppId
) {
  const { data } = await performDisputableVotingQuery(
    disputableAddress,
    disputableActionId,
    disputableAppId
  )

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

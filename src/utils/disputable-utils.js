import { getContract } from '../web3-contracts'
import disputableAbi from '../abi/disputables/IDisputable.json'
import disputableDandelionVotingAbi from '../abi/disputables/DisputableDandelionVoting.json'
import disputableDelayAbi from '../abi/disputables/DisputableDelay.json'
import disputableVotingAbi from '../abi/disputables/DisputableVoting.json'

const DANDELION_VOTING_APP_ID =
  '0x2d7442e1c4cb7a7013aecc419f938bdfa55ad32d90002fb92ee5969e27b2bf07'
const DELAY_APP_ID =
  '0x1c2b93ad1c4d4302f0169c8f596ce518e4a3324b1fed90c2d80a549a072bcd4e'
const VOTING_APP_ID =
  '0x9fa3927f639745e587912d4b0fea7ef9013bf93fb907d29faeab57417ba6e1d4'

const DISPUTABLE_ACTIONS = new Map([
  [
    DANDELION_VOTING_APP_ID,
    {
      abi: disputableDandelionVotingAbi,
      fn: 'getVote',
      scriptPosition: 10,
    },
  ],
  [
    DELAY_APP_ID,
    {
      abi: disputableDelayAbi,
      fn: 'delayedScripts',
      scriptPosition: 4,
    },
  ],
  [
    VOTING_APP_ID,
    { abi: disputableVotingAbi, fn: 'getVote', scriptPosition: 9 },
  ],
])

export async function getDisputedActionRadspec(
  disputableAddress,
  disputableActionId
) {
  try {
    // Get disputable appId
    const disputableContract = getContract(disputableAddress, disputableAbi)
    const appId = await disputableContract.appId()

    if (DISPUTABLE_ACTIONS.has(appId)) {
      const { abi, fn, scriptPosition } = DISPUTABLE_ACTIONS.get(appId)

      const appContract = getContract(disputableAddress, abi)
      const result = await appContract[fn](disputableActionId)
      const evmScript = result[scriptPosition]

      return evmScript
    }
  } catch (err) {
    console.error('Error fetching appId', err)
  }

  return null
}

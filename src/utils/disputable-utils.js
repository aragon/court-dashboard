import {
  connect,
  describeScript,
  findAppMethodFromIntent,
} from '@aragon/connect'
import { getContract } from '../web3-contracts'
import {
  addressesEqual,
  sanitizeNetworkType,
  getNetworkType,
} from '../lib/web3-utils'
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

const cachedDescriptions = new Map([])

const DISPUTABLE_ACTIONS = new Map([
  [
    DANDELION_VOTING_APP_ID,
    {
      abi: disputableDandelionVotingAbi,
      entity: 'vote',
      fn: 'getVote',
      scriptPosition: 10,
    },
  ],
  [
    DELAY_APP_ID,
    {
      abi: disputableDelayAbi,
      entity: 'delay',
      fn: 'delayedScripts',
      scriptPosition: 2,

      // disputable position:
      // scriptPosition: 4,
    },
  ],
  [
    VOTING_APP_ID,
    {
      abi: disputableVotingAbi,
      entity: 'vote',
      fn: 'getVote',
      scriptPosition: 9,
    },
  ],
])

export async function describeDisputedAction(
  disputeId,
  organization,
  disputableAddress,
  disputableActionId
) {
  try {
    if (cachedDescriptions.has(disputeId)) {
      return cachedDescriptions.get(disputeId)
    }
    // Get disputable appId
    const disputableContract = getContract(disputableAddress, disputableAbi)
    const appId = await disputableContract.appId()

    if (DISPUTABLE_ACTIONS.has(appId)) {
      const { abi, entity, fn, scriptPosition } = DISPUTABLE_ACTIONS.get(appId)

      // Get disputed action script
      const appContract = getContract(disputableAddress, abi)
      const result = await appContract[fn](disputableActionId)
      const evmScript = result[scriptPosition]

      // Describe script
      const org = await connect(organization, 'thegraph')
      const apps = await org.apps()

      const transactionRequests = (await describeScript(evmScript, apps)) || []

      // TODO: Should we have a default action description in the case we can't describe the script ?
      if (transactionRequests.length > 0) {
        const transactionRequest = transactionRequests[0]
        const terminalActionAppAddress = transactionRequest.to

        // Find the App object cooresponding to the disputed terminal action
        const app = apps.find(app =>
          addressesEqual(app.address, terminalActionAppAddress)
        )

        // Get the app method from the transaction request data
        const method = await findAppMethodFromIntent(app, transactionRequest)

        // TODO: Should we have a default method description in the case the action is not protected by a role?
        if (method) {
          // Get role extended description
          const roleName = getRoleName(app, method)

          const disputedActionDescription = {
            disputedActionText: buildDisputedActionText(app, roleName),
            disputedActionRadspec: buildDisputedActionRadspec(
              transactionRequests
            ),
            disputedActionURL: buildDisputedActionUrl(
              organization,
              disputableAddress,
              entity,
              disputableActionId
            ),
          }
          // Cache disputable metadata
          cachedDescriptions.set(disputeId, disputedActionDescription)

          return disputedActionDescription
        }
      }
    }
  } catch (err) {
    console.error('Error describing disputable action', err)
  }

  return {}
}

function getRoleName(app, method) {
  const role = app.artifact.roles.find(role => method.roles.includes(role.id))
  return role?.name
}

function buildDisputedActionText(app, action) {
  const { name } = app
  const capitalizedAppName = `${name.slice(0, 1).toUpperCase()}${name.slice(1)}`
  return `${capitalizedAppName}: ${action}`
}

function buildDisputedActionRadspec(transactions) {
  return transactions.length
    ? transactions
        .map(step => {
          const identifier = step.identifier ? ` (${step.identifier})` : ''
          const app = step.name ? `${step.name}${identifier}` : `${step.to}`

          return `${app}: ${step.description || 'No description'}`
        })
        .join('\n')
    : ''
}

function buildDisputedActionUrl(organization, appAddress, entity, actionId) {
  // TODO: Consider the possibility where the main Org frontend is not the Aragon client
  const orgUrl = getOrgUrl(organization)
  return [orgUrl, appAddress, entity, actionId].join('/')
}

function getOrgUrl(organizationAddress) {
  const networkType = sanitizeNetworkType(getNetworkType())
  return `https://${networkType}.aragon.org/#/${organizationAddress}`
}

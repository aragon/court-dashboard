import {
  connect,
  describeScript,
  findAppMethodFromIntent,
} from '@aragon/connect'
import { getContract } from '../web3-contracts'
import env from '../environment'
import {
  addressesEqual,
  sanitizeNetworkType,
  getNetworkType,
} from '../lib/web3-utils'

// Disputable apps abis
import disputableAbi from '../abi/disputables/IDisputable.json'
import disputableDandelionVotingAbi from '../abi/disputables/DisputableDandelionVoting.json'
import disputableDelayAbi from '../abi/disputables/DisputableDelay.json'
import disputableVotingAbi from '../abi/disputables/DisputableVoting.json'

const MAX_FORWARDING_DEPTH = 4

// Disputable appIds
const DANDELION_VOTING_APP_ID =
  '0x2d7442e1c4cb7a7013aecc419f938bdfa55ad32d90002fb92ee5969e27b2bf07'
const DELAY_APP_ID =
  '0x1c2b93ad1c4d4302f0169c8f596ce518e4a3324b1fed90c2d80a549a072bcd4e'
const VOTING_APP_ID =
  '0x9fa3927f639745e587912d4b0fea7ef9013bf93fb907d29faeab57417ba6e1d4'

const cachedDescriptions = new Map([])

// Mapping of all disputable apps appId to their
// corresponding method for describing a disputed action.
// TODO: Add Conviction Voting
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
      const disputableAppContract = getContract(disputableAddress, abi)
      const result = await disputableAppContract[fn](disputableActionId)
      const evmScript = result[scriptPosition]

      // Get long and short description corrsponding to the disputed action.
      const [
        disputedActionRadspec,
        disputedActionText,
      ] = await describeActionScript(evmScript, organization)

      const disputedActionDescription = {
        disputedActionText,
        disputedActionRadspec,

        // Build URL where the disputed action is taking place
        disputedActionURL: buildDisputedActionUrl(
          organization,
          disputableAddress,
          entity,
          disputableActionId
        ),
      }

      // Cache disputed action description
      cachedDescriptions.set(disputeId, disputedActionDescription)

      return disputedActionDescription
    }
  } catch (err) {
    console.error('Error describing disputable action', err)
  }

  return { disputedActionRadspec: 'No description' }
}

/**
 * Describes the disputed action script using @aragon/connect
 * @param {String} evmScript The EVM script to describe
 * @param {String} organization Address of the organization in question
 * @returns {Array} Array where items are an array of transaction requests in the path of the disputed action
 *                    and the app belonging to the organization where the disputed action is taking place respectively.
 */
async function describeActionScript(evmScript, organization) {
  const org = await connect(organization, 'thegraph', {
    chainId: env('CHAIN_ID'),
  })
  const apps = await org.apps()

  const transactionRequests =
    (await describeScript(evmScript, apps, org.provider)) || []

  // In order to get the terminal action/s we must search through the `transactionRequests` children (if any)
  const terminalActions = getTerminalActions(transactionRequests)
  // In most cases we'll have just a single action to describe
  // If we do have multiple, we use the first action.
  const terminalAction = terminalActions[0]
  const terminalActionAppAddress = terminalAction.to

  // Find the App object corresponding to the app where the terminal action will take place
  const app = apps.find(app =>
    addressesEqual(app.address, terminalActionAppAddress)
  )

  // Get disputed action long description
  const disputedActionRadspec = terminalActions.length
    ? buildDisputedActionRadspec(terminalActions)
    : 'No description'

  // Get disputed action short text
  // Find method corresponding to the function of the disputed action.
  const method = await findAppMethodFromIntent(app, terminalAction)
  const disputedActionText = method ? buildDisputedActionText(app, method) : ''

  return [disputedActionRadspec, disputedActionText]
}

function getTerminalActions(transactions) {
  return transactions
    .map(transaction =>
      transaction.children
        ? getTerminalActions(transaction.children)
        : transaction
    )
    .flat(MAX_FORWARDING_DEPTH)
}

/**
 * Describes function signature (e.g grantPermission => Grant permission)
 * @param {String} sig Signature of the function to describe
 * @returns {String} Described signature
 */
function describeFunctionSig(sig) {
  return sig
    .replace(/\(.*?\)/, '')
    .split(/(?=[A-Z])/)
    .map((s, index) => (index === 0 ? capitalize(s) : s.toLowerCase()))
    .join(' ')
}

/**
 * Builds the disputed action short description
 * @param {App} app App where the disputed terminal action will take place
 * @param {Object} method Method corresponding to the disputed terminal action function
 * @returns {String} Short description of the disputed action
 */
function buildDisputedActionText(app, method) {
  const { artifact, name } = app
  const role = artifact.roles.find(role => method.roles.includes(role.id))

  // If the terminal action function is not ptoected by a role, we'll try to describe the function signature
  // (e.g grantPermission would become Grant permission)
  const actionText = role?.name || describeFunctionSig(method.sig)

  // If `name` is null most likely means the app is Kernel or ACL
  const appName = name
    ? name
        .split('-')
        .map(capitalize)
        .join(' ')
    : 'System app' // TODO: Update to more meaningfull name?

  return `${appName}: ${actionText}`
}

/**
 * Builds the disputed action radspec description
 * @param {Array<Object>} transactions Transactions in the disputed action path
 * @returns {String} Radspec description of the disputed action
 */
function buildDisputedActionRadspec(transactions) {
  return transactions.length
    ? transactions
        .map(step => {
          return `${step.description || 'No description'}`
        })
        .join('\n')
    : ''
}

/**
 * Builds the URL corresponding to the disputed action. (e.g the URL of a vote)
 * @param {String} organization Address of the organization
 * @param {String} appAddress Address of the app
 * @param {String} entity Entity where the action is being disputed (e.g vote, delay, etc)
 * @param {String} actionId Disputable action id
 * @returns {String} URL of the disputed action.
 */
function buildDisputedActionUrl(organization, appAddress, entity, actionId) {
  const orgUrl = buildOrgUrl(organization)
  return [orgUrl, appAddress, entity, actionId].join('/')
}

/**
 * Builds URL of the organization
 * @param {String} organization Address of the organization in question
 * @returns {String} URL of the organization
 */
function buildOrgUrl(organization) {
  const networkType = sanitizeNetworkType(getNetworkType())

  // TODO: Consider the possibility where the main Org frontend is not the Aragon client
  return `https://${networkType}.aragon.org/#/${organization}`
}

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

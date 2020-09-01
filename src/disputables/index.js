import {
  connect,
  describeScript,
  findAppMethodFromIntent,
} from '@aragon/connect'
import { getContract } from '../web3-contracts'
import { logWithSentry } from '../sentry'

import env from '../environment'
import { DISPUTABLE_ACTIONS } from './mappings'
import { getAragonSubgraph } from './connect-endpoints'
import { addressesEqual, getNetworkType } from '../lib/web3-utils'
import { buildArbitrableUrl, isArbitrableKnown } from './known-arbitrables'

// Disputable abi
import disputableAbi from '../abi/disputables/IDisputable.json'

const cachedDescriptions = new Map([])

const ERROR_MSG = 'Failed to fetch disputed action'

/**
 * Get disputable long and short description as well as the URL where the disputed action is taking place
 * @param {String} disputeId Id of the dispute
 * @param {String} organization Address of the organization where the action is being disputed
 * @param {String} disputableAddress Address of the disputable app where the disputed action is taking place
 * @param {String} disputableActionId Disputed action's id relative to the disputable app (e.g. in the context of a disputable voting app, vote #6)
 * @param {String} arbitrableAddress Address of the arbitrable
 * @returns {Object} Object containing the disputed action short and long description as well as the URL.
 */
export async function describeDisputedAction(
  disputeId,
  organization,
  disputableAddress,
  disputableActionId,
  arbitrableAddress
) {
  try {
    if (cachedDescriptions.has(disputeId)) {
      return cachedDescriptions.get(disputeId)
    }
    // Get disputable appId
    const disputableContract = getContract(disputableAddress, disputableAbi)
    const appId = await disputableContract.appId()

    if (DISPUTABLE_ACTIONS.has(appId)) {
      const { entityPath, scriptExtractor } = DISPUTABLE_ACTIONS.get(appId)

      const evmScript = await scriptExtractor(
        disputableAddress,
        disputableActionId,
        appId
      )

      const disputedActionURL = buildDisputedActionUrl(
        organization,
        disputableAddress,
        entityPath,
        disputableActionId,
        arbitrableAddress
      )

      const [
        disputedActionRadspec,
        disputedActionText,
        executionPath,
      ] = await describeActionScript(evmScript, organization)

      // Get long and short description corresponding to the disputed action.

      const disputedActionDescription = {
        disputedActionRadspec,
        disputedActionText,

        // Build URL where the disputed action is taking place
        disputedActionURL,

        // Transaction path
        executionPath,
      }

      // Cache disputed action description
      cachedDescriptions.set(disputeId, disputedActionDescription)

      return disputedActionDescription
    }
  } catch (err) {
    console.error('Error describing disputable action', err)
    logWithSentry(`'Error describing disputable action ${err}`)
  }

  return { disputedActionRadspec: ERROR_MSG }
}

/**
 * Describes the disputed action script using @aragon/connect
 * @param {String} evmScript The EVM script to describe
 * @param {String} organization Address of the organization in question
 * @returns {Array} Array of items where the first item is an array of transaction requests in the path of the disputed action
 *                    and the second item, the app belonging to the organization where the disputed action is taking place.
 */
async function describeActionScript(evmScript, organization) {
  // No EVM script, means it's not an executable action (e.g. signaling vote)
  if (evmScript === '0x') {
    return []
  }

  const org = await connect(
    organization,
    ['thegraph', { orgSubgraphUrl: getAragonSubgraph() }], // TODO: Remove when @aragon/connect defaults to own node subgraph urls
    {
      network: env('CHAIN_ID'),
    }
  )
  const apps = await org.apps()

  const transactionRequests =
    (await describeScript(evmScript, apps, org.provider)) || []

  if (!transactionRequests.length) {
    return [ERROR_MSG]
  }

  // Get disputed action long description
  const disputedActionRadspec = buildDisputedActionRadspec(transactionRequests)
  // In order to get the terminal action/s we must search through the `transactionRequests` children (if any)
  const terminalActions = getTerminalActions(transactionRequests)
  const executionPath = contextualizeExecutionPath(transactionRequests, apps)

  // Get disputed action short text
  // In most cases we'll have just a single action to describe
  // If we do have multiple, we use the first action.
  const terminalAction = terminalActions[0]
  const terminalActionAppAddress = terminalAction.to

  // Find the App object corresponding to the app where the terminal action will take place
  const app = apps.find(app =>
    addressesEqual(app.address, terminalActionAppAddress)
  )

  // Get disputed action short text
  // Find method corresponding to the function of the disputed action.
  const method = await findAppMethodFromIntent(app, terminalAction)
  const disputedActionText = method ? buildDisputedActionText(app, method) : ''

  return [disputedActionRadspec, disputedActionText, executionPath]
}

/**
 * Gets the array of all children transactions belonging to first step transactions in a forwarding path
 * @param {Array} transactions Array of transactions corresponding to the first step in a forwarding path
 * @returns {Array} Array of all childrens.
 */
function getTerminalActions(transactions) {
  return transactions
    .map(transaction =>
      transaction.children
        ? getTerminalActions(transaction.children)
        : transaction
    )
    .flat()
}

/**
 * Gets execution path specified by `transactions`
 * @param {Array} transactions Array of transactions in the execution path
 * @param {Array} apps Array of all the org's apps
 * @returns {Array} Execution path
 */
function contextualizeExecutionPath(transactions, apps) {
  return transactions.map(transaction => {
    const { name } =
      apps.find(app => addressesEqual(app.address, transaction.to)) || {}
    const appName = name ? describeAppName(name) : 'Unknown app'

    return {
      ...transaction,
      appName,
      children: transaction.children
        ? contextualizeExecutionPath(transaction.children, apps)
        : [],
    }
  })
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
  const { artifact, name, appId } = app
  const role = artifact.roles.find(role => method.roles.includes(role.id))

  // If the terminal action function is not protected by a role, we'll try to describe the function signature
  // (e.g grantPermission would become Grant permission)
  const actionText = role?.name || describeFunctionSig(method.sig)

  // If `name` is null most likely means the app is Kernel or ACL
  const appName = name ? describeAppName(name) : `Unknown app (${appId})`

  return `${appName}: ${actionText}`
}

/**
 * Builds the disputed action radspec description
 * Assumes array of transactions not empty
 * @param {Array<Object>} transactions Transactions in the disputed action path
 * @returns {String} Radspec description of the disputed action
 */
function buildDisputedActionRadspec(transactions) {
  return transactions
    .map(step => {
      return `${step.description || 'No description'}`
    })
    .join('\n')
}

/**
 * Builds the URL corresponding to the disputed action. (e.g the URL of a vote)
 * @param {String} organization Address of the organization
 * @param {String} appAddress Address of the app
 * @param {String} entityPath Entity where the action is being disputed (e.g vote, delay, etc)
 * @param {String} actionId Disputable action id
 * @param {String} arbitrableAddress Address of the arbitrable
 * @returns {String} URL of the disputed action.
 */
function buildDisputedActionUrl(
  organization,
  appAddress,
  entityPath,
  actionId,
  arbitrableAddress
) {
  const networkType = getNetworkType()
  const arbitrableKnown = isArbitrableKnown(arbitrableAddress, networkType)

  let url
  if (arbitrableKnown) {
    url = buildArbitrableUrl(arbitrableAddress, actionId, networkType)
  } else {
    // Fallback to Aragon client url
    url = buildClientUrl(
      organization,
      appAddress,
      entityPath,
      actionId,
      networkType
    )
  }

  return url
}

/**
 * Builds URL of the organization in the Aragon client
 * @param {String} organization Address of the organization in question
 * @param {String} appAddress Address of the app
 * @param {String} entityPath Realtive path where the disputed action is taking place
 * @param {String} actionId Id of the disputed action in the context of the disputable app
 * @param {String} networkType The network type
 * @returns {String} URL of the organization
 */
function buildClientUrl(
  organization,
  appAddress,
  entityPath,
  actionId,
  networkType
) {
  return [
    `https://${networkType}.aragon.org/#/${organization}`,
    appAddress,
    entityPath,
    actionId,
  ].join('/')
}

const describeAppName = appName =>
  appName
    .split('-')
    .map(capitalize)
    .join(' ')

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

import { CourtModuleType } from '../types/court-module-types'
import { bigNum } from '../lib/math-utils'
import { transformSubscriptionModuleDataAttributes } from './subscription-utils'

export function transformCourtConfigDataAttributes(courtConfig) {
  const { subscriptions: subscriptionModule } = courtConfig
  return {
    ...courtConfig,
    draftFee: bigNum(courtConfig.draftFee),
    settleFee: bigNum(courtConfig.settleFee),
    jurorFee: bigNum(courtConfig.jurorFee),
    minActiveBalance: bigNum(courtConfig.minActiveBalance),
    maxRegularAppealRounds: parseInt(courtConfig.maxRegularAppealRounds, 10),
    termDuration: parseInt(courtConfig.termDuration, 10) * 1000,
    currentTerm: parseInt(courtConfig.currentTerm, 10),
    evidenceTerms: parseInt(courtConfig.evidenceTerms, 10),
    commitTerms: parseInt(courtConfig.commitTerms, 10),
    revealTerms: parseInt(courtConfig.revealTerms, 10),
    appealTerms: parseInt(courtConfig.appealTerms, 10),
    appealConfirmationTerms: parseInt(courtConfig.appealConfirmationTerms, 10),
    terms: courtConfig.terms.map(term => ({
      ...term,
      startTime: parseInt(term.startTime, 10) * 1000,
    })),
    subscriptionModule: transformSubscriptionModuleDataAttributes(
      subscriptionModule
    ),
  }
}

function getFirstTermStartTime(terms) {
  if (terms.length === 0) {
    throw new Error('Terms cannot be empty')
  }

  return terms[0].startTime
}

export function getExpectedCurrentTermId(now, { terms, termDuration }) {
  const firstTermStartTime = getFirstTermStartTime(terms)
  return Math.floor((now.valueOf() - firstTermStartTime) / termDuration)
}

export function getTermStartTime(termId, { terms, termDuration }) {
  const firstTermStartTime = getFirstTermStartTime(terms)
  return termId * termDuration + firstTermStartTime
}

export function getTermEndTime(termId, { terms, termDuration }) {
  let termEndTime = 0

  const termStartTime = getTermStartTime(termId, { terms, termDuration })
  termEndTime = termStartTime + (termDuration - 1)

  return termEndTime
}

export function getTermPeriod(termId, { terms, termDuration }) {
  return [getTermStartTime, getTermEndTime].map(f =>
    f(termId, { terms, termDuration })
  )
}

export function getModuleAddress(modules, moduleType) {
  const courtModule = modules.find(
    mod => CourtModuleType[mod.type] === moduleType
  )

  return courtModule ? courtModule.address : null
}

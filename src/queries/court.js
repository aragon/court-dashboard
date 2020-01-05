import gql from 'graphql-tag'

export const CourtConfig = gql`
  subscription {
    courtConfig(id: "0xc89ce4735882c9f0f0fe26686c53074e09b0d550") {
      id
      termDuration
      currentTerm
      evidenceTerms
      commitTerms
      revealTerms
      appealTerms
      appealConfirmationTerms
      terms {
        id
        startTime
      }
    }
  }
`

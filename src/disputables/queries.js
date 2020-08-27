import gql from 'graphql-tag'
import { GraphQLWrapper } from '@aragon/connect-thegraph'

export function performQuery(subgraph, query, args) {
  const wrapper = new GraphQLWrapper(subgraph)
  return wrapper.performQuery(query, args)
}

export const disputableVotingQuery = gql`
  query DisputableVoting($id: ID!, $voteId: BigInt!) {
    disputableVoting(id: $id) {
      votes(where: { voteId: $voteId }) {
        script
      }
    }
  }
`

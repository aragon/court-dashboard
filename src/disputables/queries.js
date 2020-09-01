import gql from 'graphql-tag'
import { Client } from 'urql'
import { getSubgraphByAppId } from './connect-endpoints'

export function performDisputableVotingQuery(id, voteId, appId) {
  // Disputable voting now saves the hash of the evmScript so we need to get it from the subgraph.
  const subgraphUrl = getSubgraphByAppId(appId)

  return performQuery(subgraphUrl, disputableVotingQuery, {
    id,
    voteId,
  })
}

function performQuery(subgraph, query, args) {
  const client = new Client({ url: subgraph })

  return client.query(query, args).toPromise()
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

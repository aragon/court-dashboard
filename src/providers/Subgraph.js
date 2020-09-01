import React from 'react'
import {
  createClient,
  Provider as UrqlProvider,
  cacheExchange,
  debugExchange,
} from 'urql'
import { getFetchExchange, getSubscriptionExchange } from '../graphql-exchanges'

import { devtoolsExchange } from '@urql/devtools'
import { defaultSubgraphHttpEndpoint } from '../endpoints'

const SubgraphContext = React.createContext({ resetSubgraphClient: null })

const newClient = resetSubscription =>
  createClient({
    url: defaultSubgraphHttpEndpoint,
    exchanges: [
      debugExchange,
      devtoolsExchange,
      cacheExchange,
      getFetchExchange(),
      getSubscriptionExchange(resetSubscription),
    ],
  })

function SubGraphProvider({ children }) {
  const [client, setClient] = React.useState(newClient(false))

  return (
    <SubgraphContext.Provider
      value={{
        resetSubgraphClient: () => setClient(newClient(true)),
      }}
    >
      <UrqlProvider value={client}>{children}</UrqlProvider>
    </SubgraphContext.Provider>
  )
}

const useSubgraph = () => React.useContext(SubgraphContext)

export { SubGraphProvider, useSubgraph }

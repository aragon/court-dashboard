import React from 'react'
import { IdentityBadge } from '@aragon/ui'
import { getNetworkType } from '../../lib/web3-utils'

function LocalIdentityBadge({ entity, ...props }) {
  return (
    <IdentityBadge entity={entity} networkType={getNetworkType()} {...props} />
  )
}

LocalIdentityBadge.propTypes = {
  ...IdentityBadge.propTypes,
}

export default LocalIdentityBadge

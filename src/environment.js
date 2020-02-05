const DEFAULT_CHAIN_ID = 4 // rinkeby

const envVars = {
  CHAIN_ID: parseInt(process.env.REACT_APP_CHAIN_ID) || DEFAULT_CHAIN_ID, // TODO: Find a way to remove REACT_APP prefix
  FORTMATIC_API_KEY: process.env.REACT_APP_FORTMATIC_API_KEY,
  PORTIS_DAPP_ID: process.env.REACT_APP_PORTIS_DAPP_ID,
}

export const DEFAULT_LOCAL_CHAIN = 'rpc'

export default function env(name) {
  const envVar = envVars[name]
  return envVar === undefined ? null : envVar
}

export const PROVIDERS = [{ id: 'injected' }, { id: 'frame' }]

if (env('FORTMATIC_API_KEY')) {
  PROVIDERS.push({
    id: 'fortmatic',
    useWalletConf: { apiKey: env('FORTMATIC_API_KEY') },
  })
}

if (env('PORTIS_DAPP_ID')) {
  PROVIDERS.push({
    id: 'portis',
    useWalletConf: { dAppId: env('PORTIS_DAPP_ID') },
  })
}

export const KnownArbitrables = {
  main: new Map(
    [].map(arbitrable => [arbitrable.address.toLowerCase(), arbitrable])
  ),
  rinkeby: new Map(
    [
      {
        address: '0x9c92dbd8a8e5903e2741202321073091109f26be',
        link: 'https://network-dashboard.vercel.app/#',
        entityPath: 'proposals',
      },
    ].map(arbitrable => [arbitrable.address.toLowerCase(), arbitrable])
  ),
}

export const getKnownArbitrable = (networkType, address) => {
  if (!KnownArbitrables[networkType]) return null
  return KnownArbitrables[networkType].get(address.toLowerCase()) || null
}

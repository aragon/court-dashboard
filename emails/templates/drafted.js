const { addressBadge, action, infobox, base, link } = require('./shared')

module.exports = function() {
  return base({
    title: 'Notifications',
    subtitle: `
      Here are the notifications for the address
      ${addressBadge('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd')}
      on Thursday, 17 Dec, 2019
    `,
    content: `
        ${infobox({
          mode: 'positive',
          primary: `
            You have been selected to arbitrate ${link('Dispute #14', '', {
              nowrap: true,
            })}
          `,
          secondary: `
            You can start reviewing the evidence and then commit your vote
          `,
        })}
        ${action('Start reviewing evidence', '', { padding: '16px 0 0' })}
      `,
  })
}

const { action, infobox, base, link } = require('./shared')

module.exports = function() {
  return base({
    title: 'Notifications',
    subtitle: 'Here are your notifications for Thursday, 17 Dec, 2019',
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

const { addressBadge, action, infobox, base, link } = require('./shared')
const { accountData } = require('../mock-utils')

module.exports = function() {
  return {
    template: base({
      title: 'Notifications',
      subtitle: `Here are the notifications for the address ${addressBadge()} on {{date}}`,
      content: `
        ${infobox({
          mode: 'positive',
          primary: `
            You have been selected to arbitrate ${link(
              'Dispute #{{disputeId}}',
              '{{disputeUrl}}',
              { nowrap: true }
            )}`,
          secondary:
            'You can start reviewing the evidence and then commit your vote',
        })}
        ${action('Start reviewing evidence', '{{disputeUrl}}', {
          padding: '16px 0 0',
        })}
      `,
    }),
    mockdata: {
      ...accountData('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd'),
      date: 'Thursday, 17 Dec, 2019',
      disputeId: '14',
      disputeUrl: '',
    },
  }
}

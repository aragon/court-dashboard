const {
  action,
  addressBadge,
  base,
  infobox,
  link,
} = require('../template-utils')
const { accountData } = require('../mock-utils')

module.exports = function() {
  return {
    template: base(
      {
        title: 'Notifications',
        subtitle: `Your account ${addressBadge()} received a notification on {{date}}`,
      },
      `
        ${infobox({
          mode: 'positive',
          primary: `
            ${link('Dispute #{{disputeId}}', '{{disputeUrl}}', {
              nowrap: true,
            })} has been ruled as “{{disputeResult}}”`,
          secondary: 'You can see the final result and claim any rewards',
        })}
        ${action('See result', '{{disputeUrl}}', {
          padding: '16px 0 0',
        })}
      `
    ),
    templateText: `
      Aragon Court Notifications

      Your account {{account}} received a notification on {{date}}:

      Dispute #{{disputeId}} has been ruled as {{disputeResult}}. You can see
      the final result and claim any rewards.

      See result: {{disputeUrl}}

      This service is provided by Aragon One AG [1]. You are receiving this email
      because you are subscribed to Aragon Court Email Notifications. You can
      contact us at support@aragon.org if you not longer wish to receive these.

      [1] https://aragon.one/
    `,
    mockData: {
      ...accountData('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd'),
      date: 'Thursday, 17 Dec. 2019',
      disputeId: '14',
      disputeUrl: '',
      disputeResult: 'Allowed',
    },
  }
}

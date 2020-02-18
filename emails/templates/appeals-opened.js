const {
  addressBadge,
  action,
  infobox,
  base,
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
            Appeals are now open for a Preliminary Ruling of ${link(
              'Dispute #{{disputeId}}',
              '{{disputeUrl}}',
              { nowrap: true }
            )}`,
          secondary: '{{secondary}}',
        })}
        ${action('{{actionLabel}}', '{{actionUrl}}', {
          padding: '16px 0 0',
        })}
      `
    ),
    templateText: `
      Aragon Court Notifications

      Your account {{account}} received a notification on {{date}}:

      Appeals are now open for a Preliminary Ruling of Dispute #{{disputeId}}.

      {{secondary}}

      {{actionLabel}}: {{actionUrl}}

      This service is provided by Aragon One AG [1]. You are receiving this email
      because you are subscribed to Aragon Court Email Notifications. You can
      contact us at support@aragon.org if you not longer wish to receive these.

      [1] https://aragon.one/
    `,
    mockData: {
      ...accountData('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd'),
      date: 'Thursday, 17 Dec. 2019',
      disputeId: '14',
      disputeUrl: 'https://example.org/',
      actionLabel: 'Appeal Ruling',
      actionUrl: 'https://example.org/',
      notificationsSettingsUrl: '',
      secondary: `
        Now that Voting has ended, Preliminary Rulings can be appealed by
        anyone, including you. If you disagree with the ruling made by your
        fellow jurors and believe it will be overturned by larger set of jurors
        you can appeal the dispute and earn a reward if you are successful.
      `
    },
  }
}

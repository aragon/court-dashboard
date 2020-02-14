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
        subtitle: `Here are the notifications for the address ${addressBadge()} on {{date}}`,
      },
      `
        ${infobox({
          mode: 'negative',
          primary: `Your vote wasn’t cast on time`,
          secondary: `Some of your ${link(
            'locked ANJ balance',
            '{{lockedAnjBalanceUrl}}'
          )} has been forfeit.`,
        })}
        ${action('Learn more', '{{learnMoreUrl}}', { padding: '16px 0 0' })}
      `
    ),
    templateText: `
      Aragon Court Notifications

      This service is provided by Aragon One AG [1]. You are receiving this email
      because you are subscribed to Aragon Court Email Notifications. You can
      contact us at support@aragon.org if you not longer wish to receive these.

      [1] https://aragon.one/
    `,
    mockData: {
      ...accountData('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd'),
      date: 'Thursday, 17 Dec, 2019',
      lockedAnjBalanceUrl: '',
      learnMoreUrl: '',
      notificationsSettingsUrl: '',
    },
  }
}

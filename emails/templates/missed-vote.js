const { addressBadge, action, infobox, base, link } = require('./shared')
const { accountData } = require('../mock-utils')

module.exports = function() {
  return {
    template: base({
      title: 'Notifications',
      subtitle: `Here are the notifications for the address ${addressBadge()} on {{date}}`,
      content: `
        ${infobox({
          mode: 'negative',
          primary: `Your vote wasn’t cast on time`,
          secondary: `Some of your ${link(
            'locked ANJ balance',
            '{{lockedAnjBalanceUrl}}'
          )} has been forfeit.`,
        })}
        ${action('Learn more', '{{learnMoreUrl}}', { padding: '16px 0 0' })}
      `,
    }),
    mockData: {
      ...accountData('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd'),
      date: 'Thursday, 17 Dec, 2019',
      lockedAnjBalanceUrl: '',
      learnMoreUrl: '',
    },
  }
}

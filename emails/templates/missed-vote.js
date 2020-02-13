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
          mode: 'negative',
          primary: `
            Your vote wasn’t cast on time
          `,
          secondary: `
            Some of your ${link('locked ANJ balance', '')} has been forfeit.
          `,
        })}
        ${action('Learn more', '', { padding: '16px 0 0' })}
      `,
  })
}

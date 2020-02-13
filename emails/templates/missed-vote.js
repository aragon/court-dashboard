const { action, infobox, base, link } = require('./shared')

module.exports = function() {
  return base({
    title: 'Notifications',
    subtitle: 'Here are your notifications for Thursday, 17 Dec, 2019',
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

const { action, infobox, base, footer, link } = require('./shared')

module.exports = function() {
  return base({
    title: 'Notifications',
    subtitle: 'Here are your notifications for Thursday, 17 Dec, 2019',
    content: `
        ${infobox({
          mode: 'negative',
          primary: `
            Your vote wasn’t casted on time
          `,
          secondary: `
            Your ${link('ANJ locked balance', '')} has been discounted.
          `,
        })}
        ${action('Learn more', '', { padding: '16px 0 0' })}
      `,
  })
}

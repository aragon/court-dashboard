const mjml2html = require('mjml')
const { action, base, footer, link } = require('./shared')

module.exports = function notifications() {
  return mjml2html(
    base({
      title: 'Email Verification',
      subtitle: `
        Verify your email to receive email notifications about importand news
        and upcoming tasks.
      `,
      content: `
        <mj-text font-size="16px" line-height="24px" color="#212B36">
          To complete the verification process, please click on the button
          below. Please note that by completing this process you are agreeing
          to receive email notifications from Aragon Court.
        </mj-text>

        <mj-spacer height="40px" />

        ${action('Verify your email', '')}

        <mj-text font-size="16px" line-height="24px" color="#212B36" padding="0 40px 40px">
          Or copy and paste this URL into your browser:
          ${link(
            'https://app.aragon.org/confirm?email=paty%40aragon.one&token=BxN5wBjmCz47mrx0KsfA9KvE&mode=signup',
            ''
          )}
        </mj-text>
      `,
    })
  )
}

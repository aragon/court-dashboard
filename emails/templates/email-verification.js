const { action, base, link } = require('./shared')

module.exports = function() {
  return {
    template: base({
      title: 'Email Verification',
      subtitle: `
        Verify your email to receive email notifications about important news
        and upcoming tasks.
      `,
      content: `
        <mj-text font-size="16px" line-height="24px" color="#212B36">
          To complete the verification process, please click on the button
          below. Please note that by completing this process you are agreeing
          to receive email notifications from Aragon Court.
        </mj-text>

        <mj-spacer height="40px" />

        ${action('Verify your email', '{{verifyEmailUrl}}')}

        <mj-spacer height="40px" />

        <mj-text font-size="16px" line-height="24px" color="#212B36">
          Or copy and paste this URL into your browser:
          ${link('{{verifyEmailUrl}}', '{{verifyEmailUrl}}')}
        </mj-text>
      `,
    }),
    mockData: {
      date: 'Thursday, 17 Dec, 2019',
      verifyEmailUrl: '',
    },
  }
}

const { action, base, vspace, link } = require('../template-utils')

module.exports = function() {
  return {
    template: base(
      {
        title: 'Email Verification',
        subtitle: `
          Verify your email to receive email notifications about important news
          and upcoming tasks.
        `,
      },
      `
        <div style="font-size:16px;line-height:24px;color:#212B36">
          To complete the verification process, please click on the button
          below. Please note that by completing this process you are agreeing
          to receive email notifications from Aragon Court.
        </div>

        ${vspace(40)}

        ${action('Verify your email', '{{verifyEmailUrl}}')}

        ${vspace(40)}

        <div style="font-size:16px;line-height:24px;color:#212B36">
          Or copy and paste this URL into your browser:
          ${link('{{verifyEmailUrl}}', '{{verifyEmailUrl}}')}
        </div>
      `
    ),
    templateText: `
      Email Verification

      Verify your email to receive email notifications about important news
      and upcoming tasks.

      To complete the verification process, please click on the button below.
      Please note that by completing this process you are agreeing to receive
      email notifications from Aragon Court.

      Verify your email by copying and pasting this URL into your browser:
      {{verifyEmailUrl}}
    `,
    mockData: {
      date: 'Thursday, 17 Dec, 2019',
      verifyEmailUrl: 'https://app.aragon.org/confirm?email=paty%40aragon.one&token=BxN5wBjmCz47mrx0KsfA9KvE&mode=signup',
      notificationsSettingsUrl: '',
    },
  }
}

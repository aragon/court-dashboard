const {
  action,
  addressBadge,
  asset,
  base,
  style,
  table,
  trimMultiline,
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
        ${table(
          { align: 'center', width: '282' },
          `
            <tr>
              <td style="padding: 20px 0 50px;">
                <img width="282" src="{{headerUrl}}" alt="" style="display:block" />
              </td>
            </tr>
          `
        )}
        ${table(
          { align: 'center', width: '600' },
          `
            <tr>
              <td style="${style(`
                font-size: 18px;
                line-height: 27px;
                color: #8A96A0;
              `)}">
                {{{contentHtml}}}
              </td>
            </tr>
            <tr>
              <td style="${style(`
                padding-bottom: 50px;
              `)}">
                ${action('{{actionLabel}}', '{{actionUrl}}', {
                  padding: '16px 0 0',
                })}
              </td>
            </tr>
          `
        )}
      `
    ),
    templateText: `
      Aragon Court Notifications

      Your account {{account}} received a notification on {{date}}:

      {{title}}

      {{content}}

      {{actionLabel}}: {{actionUrl}}

      This service is provided by Aragon One AG [1]. You are receiving this email
      because you are subscribed to Aragon Court Email Notifications. You can
      contact us at support@aragon.org if you not longer wish to receive these.

      [1] https://aragon.one/
    `,
    mockData: {
      ...accountData('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd'),
      title: 'Claim your subscription rewards',
      content: trimMultiline(`
        Congratulations! You have monthly Subscription rewards available for
        activating your ANJ for a full Court period. Claim them in the
        ‘Rewards’ section of the Dashboard.
      `),
      contentHtml: `
        <h1>
          Claim your subscription rewards
        </h1>
        <p>
          Congratulations! You have monthly Subscription rewards available for
          activating your ANJ for a full Court period. Claim them in the
          ‘Rewards’ section of the Dashboard.
        </p>
      `,
      headerUrl: asset('header-anj.png'),
      date: 'Thursday, 17 Dec. 2019',
      actionLabel: 'Claim rewards',
      actionUrl: '',
    },
  }
}

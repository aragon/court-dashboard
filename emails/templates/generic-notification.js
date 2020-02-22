const {
  action,
  addressBadge,
  asset,
  base,
  table,
  style,
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
                font-size: 20px;
                line-height: 30px;
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
      title: 'You have been drafted in a void dispute (Dispute #0)',
      content: `
        Juror, you are receiving this email because you were drafted in Dispute
        #0, which was recently voided with all related content being removed
        from the Juror Dashboard.

        Since you were drafted, the protocol has locked some of your tokens, and
        these will remain locked until the dispute reaches a final ruling.

        Given the circumstances of the dispute becoming void, we recommend all
        selected jurors abstain from casting votes and allow their locked
        tokens be slashed by the protocol at the end of the dispute.

        However, all slashed tokens will be automatically reimbursed to your
        account once Dispute #0 has reached a final ruling.
      `,
      contentHtml: `
        <p>
          Juror, you are receiving this email because you were drafted in
          Dispute #0, which was recently voided with all related content being
          removed from the Juror Dashboard.
        </p>

        <p>
          Since you were drafted, the protocol has locked some of your tokens,
          and these will remain locked until the dispute reaches a final ruling.
        </p>

        <p>
          Given the circumstances of the dispute becoming void, we recommend
          all selected jurors <strong>abstain</strong> from casting votes and
          allow their locked tokens be slashed by the protocol at the end of
          the dispute.
        </p>

        <p>
          <strong>
            However, all slashed tokens will be automatically reimbursed to
            your account once Dispute #0 has reached a final ruling.
          </strong>
        </p>
      `,
      headerUrl: asset('header-dispute0.png'),
      date: 'Thursday, 17 Dec. 2019',
      actionLabel: 'Read more',
      actionUrl: '',
    },
  }
}

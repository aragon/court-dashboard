const {
  action,
  addressBadge,
  base,
  infobox,
  link,
  stripWhitespace,
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
        ${infobox({
          primary: '{{{titleHtml}}}',
          secondary: '{{{actionTextHtml}}}',
        })}
        ${action('Go to dashboard', 'https://court.aragon.org', {
          padding: '16px 0 0',
        })}
      `
    ),
    templateText: `
      Aragon Court Notifications

      Your account {{account}} received a notification on {{date}}:

      {{title}}

      {{actionText}}

      Go to dashboard: https://court.aragon.org

      This service is provided by Aragon One AG [1]. You are receiving this email
      because you are subscribed to Aragon Court Email Notifications. You can
      contact us at support@aragon.org if you not longer wish to receive these.

      [1] https://aragon.one/
    `,
    mockData: {
      ...accountData('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd'),
      date: 'Thursday, 17 Dec. 2019',
      title: 'Dispute #0 has been settled and fees reimbursements completed.',
      actionText: stripWhitespace(`
        You are recieving this notification because you have been reimbursed for
        losses incurred from your involvement in Dispute #0.

        Jurors drafted and slashed in Dispute #0 have been sent reimbursement for
        their slashed amount. If you are an active juror, the ANJ has been added
        to your Active Balance and if you are an inactive juror ANJ has been
        added to your Inactive Balance.

        Appealers can claim their collateral through the Dashboard now that the
        dispute settlement has executed. Appeal fees have been reimbursed
        directly to your account.
      `),
      titleHtml: `
        ${link('Dispute #0', 'https://court.aragon.org/disputes/0', {
          nowrap: true,
        })} has been settled and fees reimbursements completed.
      `,
      actionTextHtml: `
        <p>
          You are recieving this notification because you have been reimbursed
          for losses incurred from your involvement in Dispute #0.
        </p>

        <p>
          <strong>Jurors</strong> drafted and slashed in Dispute #0 have been
          sent reimbursement for their slashed amount. If you are an active
          juror, the ANJ has been added to your Active Balance and if you are
          an inactive juror ANJ has been added to your Inactive Balance.
        </p>

        <p>
          <strong>Appealers</strong> can claim their collateral through the
          Dashboard now that the dispute settlement has executed. Appeal fees
          have been reimbursed directly to your account.
        </p>
      `,
    },
  }
}

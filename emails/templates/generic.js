const { asset, banner, base2, button } = require('../template-utils')
const { accountData } = require('../mock-utils')

module.exports = function() {
  return {
    template: base2(
      {
        title: '{{title}}',
        preheader: '',
        banner: '{{{bannerHtml}}}',
        warningTitle: 'IMPORTANT NOTICE',
        warningContent: '{{{notice}}}',
      },
      `
        <h1>{{title}}</h1>
        <div style="color: #8A96A0">
          {{{content}}}
        </div>
        <div style="padding: 20px 0 10px">
          ${button('{{actionLabel}}', '{{actionUrl}}')}
        </div>
      `
    ),
    templateText: `
      {{title}}

      Important notice:
      {{noticeText}}

      {{contentText}}

      {{actionLabel}}: {{actionUrl}}

      This service is provided by Aragon One AG [1]. You are receiving this email
      because you are subscribed to Aragon Court Email Notifications. You can
      contact us at support@aragon.org if you not longer wish to receive these.

      [1] https://aragon.one/
    `,
    mockData: {
      ...accountData('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd'),
      date: 'Thursday, 17 Dec. 2019',
      actionLabel: 'Try the Playground',
      actionUrl: 'http://example.org/',
      title: 'Open Rinkeby environment',
      network: 'TEST NETWORK',
      bannerHtml: banner({
        height: 388,
        url: asset('banner-1.png'),
        color: '#ffffff',
        tag: { label: 'TEST NETWORK', bg: '#7C80F2', fg: '#ffffff' },
      }),
      content: `
        <p>
          The Juror Playground is a separate instance of the Juror Dashboard and
          Aragon Court on the Rinkeby testnet.
        </p>

        <p>
          We’re opening the Playground to existing jurors who wish to participate
          in stress-testing the Dashboard and Court.
        </p>

        <p>
          This is a perfect opportunity for jurors looking to familiarize
          themselves with the Dashboard in a safe environment before adjudicating
          disputes on mainnet.
        </p>

        <p>
          As always with testnets, the tokens will be valueless, so jurors are
          not subject to real financial risks (or rewards) when using the
          Playground.
        </p>

        <p>
          To get started, fill out the form linked below.
        </p>

        <p>
          Have fun, and break things!
        </p>
      `,
      contentText: `
        The Juror Playground is a separate instance of the Juror Dashboard and
        Aragon Court on the Rinkeby testnet.

        We’re opening the Playground to existing jurors who wish to participate
        in stress-testing the Dashboard and Court.

        This is a perfect opportunity for jurors looking to familiarize
        themselves with the Dashboard in a safe environment before adjudicating
        disputes on mainnet.

        As always with testnets, the tokens will be valueless, so jurors are
        not subject to real financial risks (or rewards) when using the
        Playground.

        To get started, fill out the form linked below.

        Have fun, and break things!
      `,
      notice: `
        This is an email from <strong>Aragon Court's Rinkeby test environment</strong>. This
        environment has been configured so jurors can have a playground to try
        out the new dashboard and ensure that the system is working
        correctly.
      `,
      noticeText: `
        This is an email from Aragon Court's Rinkeby test environment. This
        environment has been configured so jurors can have a playground to try
        out the new dashboard and ensure that the system is working
        correctly.
      `,
    },
  }
}

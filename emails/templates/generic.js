const {
  asset,
  banner,
  base2,
  button,
  trimMultiline,
} = require('../template-utils')

module.exports = function() {
  return {
    template: base2(
      {
        title: '{{title}}',
        preheader: '',
        banner: '{{{bannerHtml}}}',
      },
      `
        <h1>{{title}}</h1>
        <div style="color: #8A96A0">
          {{{contentHtml}}}
        </div>
        <div style="padding: 20px 0 10px">
          ${button('{{actionLabel}}', '{{actionUrl}}')}
        </div>
      `
    ),
    templateText: `
      {{title}}

      {{content}}

      {{actionLabel}}: {{actionUrl}}

      This service is provided by Aragon One AG [1]. You are receiving this email
      because you are subscribed to Aragon Court Email Notifications. You can
      contact us at support@aragon.org if you not longer wish to receive these.

      [1] https://aragon.one/
    `,
    mockData: {
      actionLabel: 'New Campaign Details >>',
      actionUrl: 'https://blog.aragon.org/juror-dispute-guide-app-mining/',
      title: 'New disputes coming soon',
      bannerHtml: banner({
        height: 388,
        url: asset('banner-precedence-restart.jpg'),
        color: '#171717',
      }),
      contentHtml: `
        <p>
          The precedence campaign is restarting soon and there are important
          changes in expectations for the upcoming disputes than were announced
          previously.
          <strong>
            The coming “mock” disputes will feature real parties and
            binding outcomes, rather than fictitious scenarios.
          </strong>
          For example, jurors will be tasked with deciding whether various
          Aragon apps should be eligible for App Mining rewards. For more
          information about App Mining and how jurors can best prepare for the
          upcoming disputes check out what’s next for the Precedence campaign
          below.
        </p>
      `,
      content: trimMultiline(`
        The precedence campaign is restarting soon and there are important
        changes in expectations for the upcoming disputes than were announced
        previously. The coming “mock” disputes will feature real parties and
        binding outcomes, rather than fictitious scenarios. For example, jurors
        will be tasked with deciding whether various Aragon apps should be
        eligible for App Mining rewards. For more information about App Mining
        and how jurors can best prepare for the upcoming disputes check out
        what’s next for the Precedence campaign below.
      `),
    },
  }
}

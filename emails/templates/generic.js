const {
  asset,
  banner,
  base2,
  button,
  stripWhitespace,
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
      actionLabel: 'Dispute #0 has been voided',
      actionUrl:
        'https://blog.aragon.one/update-on-aragon-courts-first-mock-dispute/',
      title: 'Dispute #0 has been voided',
      bannerHtml: banner({
        height: 388,
        url: asset('banner-dispute0.png'),
        color: '#171717',
      }),
      contentHtml: `
        <p>
          Jurors, be advised, Dispute #0 has been voided and discontinued due
          to unforeseen and exceptional circumstances. Your tokens are safe:
          we will resolve this dispute as the protocol allows us to, and we
          are sorry for any inconvenience. You can read more about this unique
          situation from the blog post linked below.
        </p>
      `,
      content: stripWhitespace(`
        Jurors, be advised, Dispute #0 has been voided and discontinued due
        to unforeseen and exceptional circumstances. Your tokens are safe:
        we will resolve this dispute as the protocol allows us to, and we
        are sorry for any inconvenience. You can read more about this unique
        situation from the blog post linked below.
      `),
    },
  }
}

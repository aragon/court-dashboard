const { ASSETS_URL } = require('./env')

function reqParams(fnName, values) {
  Object.entries(values).forEach(([name, value]) => {
    if (value === undefined) {
      throw new Error(`${fnName}: ${name} is not defined`)
    }
  })
}

function style(styles) {
  return styles
    .replace(/\n/g, '')
    .replace(/  /g, '')
    .replace(/: /g, ':')
}

function attrs(attributes) {
  return Object.entries(attributes).reduce(
    (htmlAttrs, [name, value]) =>
      value === null ? htmlAttrs : `${htmlAttrs} ${name}="${value}"`,
    ''
  )
}

function vspace(height) {
  return table(
    { height, style: `height: ${height}px` },
    `<tr><td style="height:${height}px">&nbsp;</td></tr>`
  )
}

function asset(path) {
  return `${ASSETS_URL}/${path}`
}

function table(attributes, content) {
  return `
    <table ${attrs({
      border: '0',
      cellpadding: '0',
      cellspacing: '0',
      role: 'presentation',
      width: '100%',
      ...attributes,
    })}>
      <tbody>
        ${content}
      </tbody>
    </table>
  `
}

function base({ title, subtitle }, content) {
  return `
    <!doctype html>
    <html
      lang="en"
      xmlns="http://www.w3.org/1999/xhtml"
      xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
    >
      <head>
        <title>Aragon Court ${title}</title>
        <!--[if !mso]><!-- -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!--<![endif]-->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
          #outlook a {
            padding: 0;
          }
          body {
            width: 100% !important;
            height: 100%;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          table,
          td {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }
          img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
          }
          p {
            display: block;
            margin: 13px 0;
          }
        </style>
        <!--[if mso]>
          <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
          </xml>
        <![endif]-->
        <!--[if !mso]><!-->
        <style type="text/css">
          @import url(https://fonts.googleapis.com/css?family=Overpass:300,400&display=swap);
        </style>
        <!--<![endif]-->
        <style type="text/css">
          @media only screen and (max-width: 480px) {
            .infobox-table {
              width: 100% !important;
            }
            .infobox-col {
              display: block !important;
              width: 100% !important;
            }
            .infobox-icon {
              text-align: center !important;
              font-size: 16px !important;
            }
            .infobox-content {
              text-align: center !important;
              padding: 0 24px 24px !important;
              font-size: 16px !important;
            }
          }
          .data-table tbody tr:first-child td {
            border-top: 0 !important;
          }
        </style>
      </head>
      <body style="background-color:#ffffff;">
        ${table(
          {
            align: 'center',
            width: '824',
            style: 'margin: 0 auto;',
            bgcolor: '#ffffff',
          },
          `<tr>
            <td style="width: 824px">
              ${table(
                { align: 'center', width: '824' },
                `<tr>
                  <td style="width: 40px">&nbsp;</td>
                  <td style="${style(`
                    direction: ltr;
                    text-align: left;
                    padding: 60px 0 24px;
                    width: 744px;
                  `)}">
                    <img
                      title="Aragon Court ${title}"
                      src="${ASSETS_URL}/header-logo.png"
                      width="110"
                      height="110"
                      style="${style(`
                        display: block;
                        border: 0;
                        outline: none;
                        text-decoration: none;
                        width: 110px;
                        height: 110px;
                        font-size: 13px;
                      `)}"
                    />
                  </td>
                </tr>`
              )}
              ${table(
                { align: 'center', style: 'width: 100%' },
                `<tr>
                  <td style="${style(`
                    direction: ltr;
                    font-size: 0;
                    padding: 0 24px;
                    text-align: center;
                  `)}">
                    <div style="${style(`
                      background: #dde4e9;
                      background-color: #dde4e9;
                      margin: 0 auto;
                      border-radius: 4px;
                      max-width: 776px;
                    `)}">
                      ${table(
                        {
                          align: 'center',
                          style: style(`
                            background: #dde4e9;
                            background-color: #dde4e9;
                            width: 100%;
                            border-radius: 4px;
                          `),
                        },
                        `<tr>
                          <td style="${style(`
                            direction: ltr;
                            font-size: 0;
                            padding: 1px;
                            text-align: center;
                          `)}">
                            <div style="${style(`
                              font-size: 0;
                              text-align: left;
                              direction: ltr;
                              display: inline-block;
                              vertical-align: top;
                              width: 100%;
                            `)}">
                              ${table(
                                { width: '100%' },
                                `<tr>
                                  <td style="${style(`
                                    background-color: #ffffff;
                                    border-radius: 4px;
                                    vertical-align: top;
                                    padding: 40px;
                                  `)}">
                                    ${table(
                                      { width: '100%' },
                                      `<tr>
                                        <td align="left" style="${style(`
                                          font-size: 0;
                                          padding: 0;
                                          word-break: break-word;
                                        `)}">
                                          <div style="${style(`
                                            font-family: Overpass, sans-serif;
                                            font-size: 24px;
                                            font-weight: 300;
                                            line-height: 32px;
                                            text-align: left;
                                            color: #2A2A2A;
                                          `)}">
                                            <span style="${style(`
                                              font-weight: 400;
                                              color: #FF9184;
                                            `)}">Aragon Court</span> ${title}
                                          </div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="${style(`
                                          font-size: 0;
                                          word-break: break-word;
                                        `)}">
                                          <div style="height:8px;">&nbsp;</div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td align="left" style="${style(`
                                          padding: 0;
                                          font-size: 0;
                                          word-break: break-word;
                                       `)}">
                                          <div style="${style(`
                                            font-family: Overpass, sans-serif;
                                            font-size: 16px;
                                            font-weight: 300;
                                            line-height: 24px;
                                            text-align: left;
                                            color: #9096B6;
                                          `)}">
                                            ${subtitle}
                                          </div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="${style(`
                                          font-size: 0;
                                          word-break: break-word;
                                        `)}">
                                          ${vspace(50)}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td align="left" style="${style(`
                                          font-size: 0;
                                          padding: 0;
                                          word-break: break-word;
                                        `)}">
                                          <div style="${style(`
                                            font-family: Overpass, sans-serif;
                                            font-size: 13px;
                                            font-weight: 300;
                                            line-height: 1;
                                            text-align: left;
                                            color: #9096B6;
                                          `)}">
                                            ${content}
                                          </div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td align="left" style="${style(`
                                          font-size: 0;
                                          padding: 0;
                                          word-break: break-word;
                                        `)}">
                                          <div style="${style(`
                                            font-family: Overpass, sans-serif;
                                            font-size: 13px;
                                            font-weight: 300;
                                            line-height: 1;
                                            text-align: left;
                                            color: #9096B6;
                                          `)}">
                                          </div>
                                        </td>
                                      </tr>`
                                    )}
                                  </td>
                                </tr>`
                              )}
                            </div>
                          </td>
                        </tr>`
                      )}
                    </div>
                  </td>
                </tr>`
              )}
              ${table(
                {
                  align: 'center',
                  style: 'width:100%',
                },
                `<tr>
                  <td style="${style(`
                    direction: ltr;
                    font-size: 0;
                    padding: 0 40px;
                    text-align: center;
                  `)}">
                    <div style="${style(`
                      font-size: 0;
                      text-align: left;
                      direction: ltr;
                      display: inline-block;
                      vertical-align: top;
                      width: 100%;
                    `)}">
                      ${table(
                        {
                          width: '100%',
                          style: 'vertical-align:top',
                        },
                        `
                          <tr>
                            <td style="${style(`
                              font-size: 0;
                              word-break: break-word;
                           `)}">
                              <div style="height:40px;">&nbsp;</div>
                            </td>
                          </tr>
                          <tr>
                            <td align="left" style="${style(`
                              font-size: 0;
                              padding: 0;
                              word-break: break-word;
                            `)}">
                              <div style="${style(`
                                font-family: Overpass, sans-serif;
                                font-size: 14px;
                                font-weight: 300;
                                line-height: 22px;
                                text-align: left;
                                color: #9096B6;
                              `)}">
                                This service is provided by ${link(
                                  'Aragon One AG',
                                  'https://aragon.one/'
                                )}. You are receiving this email because you are
                                subscribed to
                                <strong style="${style(`
                                  font-weight: 300;
                                  color: #637381
                                `)}">Aragon Court Email Notifications</strong>.
                                You can contact us at
                                <a href="mailto:support@aragon.org" style="${style(`
                                  color: #637381;
                                  text-decoration: none;
                                `)}">support@aragon.org</a>
                                if you no longer wish to receive these.
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style="${style(`
                              font-size: 0;
                              word-break: break-word;
                            `)}">
                              <div style="height:40px;">&nbsp;</div>
                            </td>
                          </tr>
                        `
                      )}
                    </div>
                  </td>
                </tr>`
              )}
            </td>
          </tr>`
        )}
      </body>
    </html>
  `
}

function tag({ extraStyle = '', bg, fg, label }) {
  return table(
    { style: `border-radius:4px;${extraStyle}`, width: null },
    `<tr>
      <td class="tag" height="32" style="${style(`
        color: ${fg};
        background: ${bg};
        white-space: nowrap;
      `)}">
        <div style="padding-top:2px">${label}</div>
      </td>
    </tr>`
  )
}

function banner({ url, height, color, tag: tagSettings }) {
  reqParams('banner()', { url, height, color })

  return table(
    { bgcolor: color },
    `<tr>
      <td
        width="100%"
        height="${height}"
        bgcolor="${color}"
        background="${url}"
        style="${style(`
          background-image: url('${url}');
          background-size: cover;
          background-repeat: no-repeat;
          background-position: top center;
        `)}"
      >

        <!--[if gte mso 9]>
          <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="mso-width-percent:1000;mso-height:${height}px;" >
            <v:fill type="tile" src="${url}" color="${color}" />
            <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
        <![endif]-->

        ${table(
          { height },
          `<tr>
            <td valign="top" height="${height}" style="height: ${height}px">
              ${
                tagSettings
                  ? tag({
                      bg: tagSettings.bg,
                      fg: tagSettings.fg,
                      label: tagSettings.label,
                      extraStyle: 'margin:24px;',
                    })
                  : ''
              }
            </td>
          </tr>`
        )}

        <!--[if gte mso 9]>
            </v:textbox>
          </v:rect>
        <![endif]-->
      </td>
    </tr>`
  )
}

// A better base(), heavily inspired from postmark templates.
// Supports dark mode and makes use of CSS.
function base2(
  {
    banner = '',
    maxWidth = 800,
    preheader = '',
    title = '',
    warningContent = '',
    warningTitle = '',
  },
  content
) {
  return `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>${title}</title>
        <style type="text/css" rel="stylesheet" media="all">
          @import url('https://fonts.googleapis.com/css?family=Overpass:300,400&display=swap');

          body {
            width: 100% !important;
            height: 100%;
            margin: 0;
            -webkit-text-size-adjust: none;
          }
          a {
            color: #3869D4;
          }
          a img {
            border: none;
          }
          td {
            word-break: break-word;
          }
          body, td, th {
            font-family: Overpass, Helvetica, Arial, sans-serif;
            font-weight: 300;
            font-style: normal;
            font-size: 18px;
            line-height: 1.5;
          }
          hr {
            margin: 48px 0 24px;
            border: 0;
            border-top: 1px solid #DDE4E9;
          }
          h1 {
            margin-top: 0;
            color: #242424;
            font-size: 32px;
            font-weight: 300;
            text-align: left;
          }
          p, ul, ol, blockquote {
            margin: 0.4em 0 1.18em;
          }
          body {
            background-color: #F2F4F6;
            color: #51545E;
          }
          .email-wrapper {
            width: 100%;
            margin: 0;
            padding: 0;
            -premailer-width: 100%;
            -premailer-cellpadding: 0;
            -premailer-cellspacing: 0;
            background-color: #FFFFFF;
          }
          .email-content {
            width: 100%;
            margin: 0;
            padding: 0;
            -premailer-width: 100%;
            -premailer-cellpadding: 0;
            -premailer-cellspacing: 0;
          }
          .email-body_inner {
            overflow: hidden;
            border-radius: 4px;
            box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.15);
          }
          .email-footer {
            font-size: 14px;
          }
          .email-footer-strong {
            font-weight: 300;
            color: #637381;
          }
          .email-warning {
            margin-bottom: 24px;
            background: #FFF1DA;
            border-radius: 4px;
            border-left: 4px solid #F5A623;
          }
          .email-warning-content {
            padding: 18px 26px;
            color: #C7871E;
            font-size: 14px;
          }
          @media (prefers-color-scheme: dark) {
            body,
            .email-body,
            .email-body_inner,
            .email-content,
            .email-wrapper {
              background-color: #141926 !important;
              color: #FFF !important;
            }
            .email-body_inner {
              background-color: #232C42 !important;
            }
            .email-warning {
              background-color: #362E25 !important;
              border-left-color: #C7871E !important;
            }
            .email-warning-content {
              color: #F5A623 !important;
            }
            p, ul, ol, blockquote, h1, h2, h3 {
              color: #FFF !important;
            }
            hr {
              border-top-color: #AAA !important;
            }
            .email-footer-strong {
              color: #FFF !important;
              font-weight: 400 !important;
            }
          }
          .button {
            display: inline-block;
            width: 100%;
            color: #FFF;
            background: #FF977E;
            border-top: 10px solid #FF977E;
            border-right: 18px solid #FF977E;
            border-bottom: 10px solid #FF977E;
            border-left: 18px solid #FF977E;
            text-decoration: none;
            border-radius: 4px;
            box-shadow: 0 2px 2px rgba(0, 0, 0, 0.15);
            -webkit-text-size-adjust: none;
            box-sizing: border-box;
            font-size: 16px;
          }
          .tag {
            height: 32px;
            font-size: 14px;
            padding: 0 16px;
            border-radius: 16px;
          }
          @media only screen and (max-width: ${maxWidth + 30}px) {
            .email-body_inner,
            .email-body_inner,
            .email-body_inner2 {
              width: 100% !important;
              box-shadow: none;
              border-radius: 0;
            }
            body, td, th {
              font-size: 18px !important;
            }
            h1 {
              font-size: 28px !important;
            }
            .email-footer {
              font-size: 14px !important;
            }
            .button {
              width: 100% !important;
              text-align: center !important;
              font-size: 16px !important;
            }
            .tag {
              height: 22px !important;
              padding: 0 10px !important;
              font-size: 10px !important;
            }
            .email-warning-content {
              font-size: 14px !important;
            }
          }
          ${preheader &&
            `.preheader {
              display: none !important;
              visibility: hidden;
              mso-hide: all;
              font-size: 1px;
              line-height: 1px;
              max-height: 0;
              max-width: 0;
              opacity: 0;
              overflow: hidden;
          }`}
        </style>
        <!--[if mso]>
        <style type="text/css">
          /* font fallback */
          .ff  {
            font-family: Arial, sans-serif;
          }
        </style>
      <![endif]-->
      </head>
      <body>
        ${preheader && `<span class="preheader">{preheader}</span>`}
        ${table(
          { class: 'email-wrapper' },
          `<tr>
            <td align="center" style="padding:60px 0">

              ${warningContent &&
                table(
                  { class: 'email-content' },
                  `<tr>
                  <td
                    width="${maxWidth}"
                    cellpadding="0"
                    cellspacing="0"
                  >
                    ${table(
                      {
                        align: 'center',
                        width: maxWidth,
                        class: 'email-body_inner email-warning',
                      },
                      `<tr>
                        <td class="email-warning-content">
                          ${warningTitle && `<strong>${warningTitle}</strong>`}
                          <br>
                          ${warningContent}
                        </td>
                      </tr>`
                    )}
                  </td>
                </tr>`
                )}

              ${table(
                { class: 'email-content' },
                `<tr>
                  <td
                    class="email-body"
                    width="${maxWidth}"
                    cellpadding="0"
                    cellspacing="0"
                  >
                    ${table(
                      {
                        class: 'email-body_inner',
                        align: 'center',
                        width: maxWidth,
                      },
                      `<tr>
                        <td>
                          ${banner}
                          ${table(
                            {
                              align: 'center',
                              class: 'email-body_inner2',
                              width: maxWidth * 0.75 + 120,
                            },
                            `<tr>
                              <td style="padding: 60px">
                                <div class="ff">

                                  ${content}

                                  <hr>
                                  <p class="ff align-center email-footer">
                                    This service is provided by ${link(
                                      'Aragon One AG',
                                      'https://aragon.one/'
                                    )}.

                                    You are receiving this email because you are
                                    subscribed to
                                    <strong class="email-footer-strong">Aragon
                                    Court Email Notifications</strong>.

                                    You can contact us at
                                    <a
                                      href="mailto:support@aragon.org"
                                      style="text-decoration: none"
                                    >support@aragon.org</a>
                                    if you no longer wish to receive these.
                                  </p>
                                </div>
                              </td>
                            </tr>`
                          )}
                        </td>
                      </tr>`
                    )}
                  </td>
                </tr>`
              )}
            </td>
          </tr>`
        )}
      </body>
    </html>
  `
}

function addressBadge(varName = 'account') {
  return `
    <a
      href="https://etherscan.io/address/{{${varName}}}"
      title="{{${varName}}}"
      style="${style(`
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 16px;
        line-height: 25px;
        color: #212B36;
        background: #EBFAFD;
        text-decoration: none;
      `)}"
    >{{${varName}Start}}&#x2026;{{${varName}End}}</a>
  `
}

function link(label, href, { nowrap = false } = {}) {
  return `
    <a
      href="${href}"
      style="${style(`
        text-decoration:none;
        color:#516DFF;
        ${nowrap ? 'white-space:nowrap;' : ''}
      `)}"
    >
      ${label}
    </a>
    `.trim()
}

function button(label, href) {
  return table(
    { width: '100%' },
    `<tr>
      <td align="center">
        <a href="${href}" class="ff button" target="_blank">${label}</a>
      </td>
    </tr>`
  )
}

function action(label, href, { padding = '0' } = {}) {
  return table(
    {
      align: 'center',
      style: style(`
        width: 100%;
        font-family: Overpass, sans-serif;
      `),
    },
    `<tr>
      <td style="${style(`
        padding: ${padding};
        text-align: center;
      `)}">
        <a
          href="${href}"
          style="${style(`
            display: block;
            text-align: center;
            width: 100%;
            height: 40px;
            font-family: Overpass, sans-serif;
            line-height: 40px;
            font-size: 16px;
            background-color: #FF8888;
            background-image: linear-gradient(184deg, #FFB36D -50%, #FF8888 90%);
            box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.15);
            border-radius: 4px;
            text-decoration: none;
            color: #FFFFFF;
            white-space: nowrap;
          `)}"
        >
          ${label}
        </a>
      </td>
    </tr>`
  )
}

function infobox({ mode, primary, secondary }) {
  const background = mode === 'negative' ? '#FFE8E8' : '#F9FAFC'
  const icon = (() => {
    if (mode === 'negative') return 'icon-negative.png'
    if (mode === 'appeals-opened') return 'icon-appeals-opened.png'
    return 'icon-positive.png'
  })()
  const primaryColor = mode === 'negative' ? '#30404F' : '#26C395'
  const secondaryColor = mode === 'negative' ? '#637381' : '#9096B6'
  return table(
    {
      width: '100%',
      class: 'infobox-table',
      style: style(`
        width: 100%;
        border-radius: 4px;
        font-family: Overpass, sans-serif;
        background-color: ${background};
      `),
    },
    `<tr>
      <td align="center" valign="center" width="83" class="infobox-col">
        ${table(
          { width: '100%' },
          `<tr>
            <td
              class="infobox-icon"
              style="${style(`
                width: 75px;
                padding: 8px 0 8px 8px;
                direction: ltr;
              `)}"
            >
              <img
                alt=""
                width="75"
                height="80"
                src="${ASSETS_URL}/${icon}"
                style="${style(`
                  border: 0;
                  outline: none;
                  text-decoration: none;
                  width: 75px;
                  height: 80px;
                  font-size: 16px;
                `)}"
              />
            </td>
          </tr>`
        )}
      </td>
      <td align="center" valign="top" class="infobox-col">
        ${table(
          { width: '100%' },
          `<tr>
            <td
              align="left"
              class="infobox-content"
              style="${style(`
                direction: ltr;
                padding: 24px 8px;
                text-align: left;
                font-size: 16px;
                color: #9096B6;
              `)}
            ">
              ${table(
                {
                  align: 'center',
                  style: style(`
                    width: 100%;
                    margin: 0;
                    font-family: Overpass, sans-serif;
                    font-weight: 300;
                  `),
                },
                `
                  <tr>
                    <td style="${style(`
                      padding-bottom: 5px;
                      direction: ltr;
                      font-size: 20px;
                      line-height: 28px;
                      color: ${primaryColor};
                    `)}">
                      ${primary}
                    </td>
                  </tr>
                  <tr>
                    <td style="${style(`
                      direction: ltr;
                      color: ${secondaryColor};
                      line-height: 24px;
                    `)}">
                      ${secondary}
                    </td>
                  </tr>
                `
              )}
            </td>
          </tr>`
        )}
      </td>
    </tr>`
  )
}

function dataTable(listName, headers) {
  return `
    <table ${attrs({
      class: 'data-table',
      border: '0',
      cellpadding: '0',
      cellspacing: '0',
      role: 'presentation',
      width: '100%',
    })}>
      <thead>
        <tr style="${style(`
          text-align: left;
          padding: 16px 0;
        `)}">
          ${headers
            .map(
              ([varName, label], index) =>
                `<th
                  style="${style(`
                    color: #637381;
                    font-size: 12px;
                    line-height: 32px;
                    white-space: nowrap;
                    font-weight: 400;
                    font-family: Overpass, sans-serif;
                    padding: ${
                      index === headers.length - 1 ? '0 0 0 16px' : '0 16px 0 0'
                    };
                    text-align: ${
                      index === headers.length - 1 ? 'right' : 'left'
                    };
                  `)}"
                >
                  ${label}
                </th>`
            )
            .join('\n')}
        </tr>
      </thead>
      <tbody>
        {{#each ${listName}}}
          <tr>
            ${headers
              .map(
                ([cellTemplate], index) => `
                  <td
                    style="${style(`
                      padding: 24px 0;
                      padding-${
                        index === headers.length - 1 ? 'left' : 'right'
                      }: 16px;
                      font-size: 16px;
                      line-height: 32px;
                      white-space: nowrap;
                      font-weight: 300;
                      font-family: Overpass, sans-serif;
                      text-align: ${
                        index === headers.length - 1 ? 'right' : 'left'
                      };
                      color: #26324E;
                      border-top: 1px solid #DDE4E9;
                    `)}"
                  >
                    ${cellTemplate}
                  </td>
                `
              )
              .join('\n')}
          </tr>
        {{/each}}
      </tbody>
    </table>
  `
}

module.exports = {
  action,
  addressBadge,
  asset,
  banner,
  base,
  base2,
  button,
  dataTable,
  infobox,
  link,
  style,
  vspace,
}

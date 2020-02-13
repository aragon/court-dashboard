const { ASSETS_URL } = require('../env')

function base({ title, subtitle, content }) {
  return `
    <mjml lang="en">
      <mj-head>
        <mj-title>Aragon Court ${title}</mj-title>
        <mj-font name="Overpass" href="https://fonts.googleapis.com/css?family=Overpass:300,400&display=swap" />
        <mj-attributes>
          <mj-image padding="0" />
          <mj-text padding="0" />
          <mj-all font-family="Overpass, sans-serif" color="#9096B6" font-weight="300" />
        </mj-attributes>
        <mj-style>
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
        </mj-style>
      </mj-head>
      <mj-body background-color="#ffffff" width="824px">
        <mj-section padding="60px 40px 24px">
          <mj-column>
            <mj-image
              width="110px"
              height="110px"
              align="left"
              title="Aragon Court ${title}"
              src="${ASSETS_URL}/header-logo.png"
            />
          </mj-column>
        </mj-section>
        <mj-wrapper padding="0 24px">
          <mj-section background-color="#dde4e9" border-radius="4px" padding="1px">
            <mj-column background-color="#ffffff" border-radius="4px" padding="40px">
              <mj-text font-weight="300" font-size="24px" line-height="32px" color="#2A2A2A">
                <span style="font-weight: 400; color: #FF9184">Aragon Court</span> ${title}
              </mj-text>
              <mj-spacer height="8px" />
              <mj-text font-size="16px" line-height="24px">
                ${subtitle}
              </mj-text>
              <mj-spacer height="50px" />
              ${content}
            </mj-column>
          </mj-section>
        </mj-wrapper>
        <mj-section padding="0 40px">
          <mj-column>
            <mj-spacer height="40px" />
            <mj-text line-height="22px" font-size="14px">
              This service is provided by ${link('Aragon One AG', '')}. You are
              receiving this email because you are subscribed to <strong
              style="font-weight:300;color:#637381">Aragon Court Email
              Notifications</strong>. You can change your email
              ${link('notifications settings', '')} if you not longer wish to
              receive these.
            </mj-text>
            <mj-spacer height="40px" />
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `
}

function addressBadge() {
  return `
    <a
      href="https://etherscan.io/address/{{account}}"
      tilte="{{account}}"
      style="
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 16px;
        line-height: 25px;
        color: #212B36;
        background: #EBFAFD;
        text-decoration: none;
      "
    >{{accountStart}}&#x2026;{{accountEnd}}</a>
  `
}

function link(label, href, { nowrap = false } = {}) {
  return `
    <a
      href="${href}"
      style="
        text-decoration:none;
        color:#516DFF;
        ${nowrap ? 'white-space:nowrap;' : ''}
      "
    >
      ${label}
    </a>
    `.trim()
}

function action(label, href, { padding = '0' } = {}) {
  return `
    <mj-text>
      <table
        role="presentation"
        cellpadding="0"
        cellspacing="0"
        border="0"
        align="center"
        style="width:100%;font-family:Overpass, sans-serif;"
      >
        <tbody>
          <tr>
            <td style="padding:${padding};text-align:center;">
              <a
                href="${href}"
                style="
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
                "
              >
                ${label}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </mj-text>
  `
}

function infobox({ mode, primary, secondary }) {
  const background = mode === 'negative' ? '#FFE8E8' : '#F9FAFC'
  const icon = mode === 'negative' ? 'icon-negative.png' : 'icon-positive.png'
  const primaryColor = mode === 'negative' ? '#30404F' : '#26C395'
  const secondaryColor = mode === 'negative' ? '#637381' : '#9096B6'
  return `
    <mj-text>
      <table
        role="presentation"
        border="0"
        cellpadding="0"
        cellspacing="0"
        width="100%"
        class="infobox-table"
        style="
          width:100%;
          border-radius:4px;
          font-family:Overpass, sans-serif;
          background-color:${background};
        "
      >
        <tr>
          <td align="center" valign="center" width="83" class="infobox-col">
            <table border="0" cellpadding="10" cellspacing="0" width="100%">
              <tr>
                <td
                  class="infobox-icon"
                  style="
                    width: 75px;
                    padding: 8px 0 8px 8px;
                    direction: ltr;
                  "
                >
                  <img
                    alt=""
                    width="75"
                    height="80"
                    src="${ASSETS_URL}/${icon}"
                    style="
                      border: 0;
                      outline: none;
                      text-decoration: none;
                      width: 75px;
                      height: 80px;
                      font-size: 16px;
                    "
                  />
                </td>
              </tr>
            </table>
          </td>
          <td align="center" valign="top" class="infobox-col">
            <table border="0" cellpadding="10" cellspacing="0" width="100%">
              <tr>
                <td
                  align="left"
                  class="infobox-content"
                  style="
                    direction: ltr;
                    padding: 24px 8px;
                    text-align: left;
                    font-size: 16px;
                    color: #9096B6;
                ">
                  <table
                    role="presentation"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    align="center"
                    style="width:100%;margin:0;font-family:Overpass, sans-serif;font-weight:300;"
                  >
                    <tbody>
                      <tr>
                        <td style="padding-bottom:5px;direction:ltr;font-size:20px;line-height:28px;color:${primaryColor};">
                          ${primary}
                        </td>
                      </tr>
                      <tr>
                        <td style="direction:ltr;color:${secondaryColor};line-height:24px;">
                          ${secondary}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </mj-text>
  `
}

function dataTable({ headers = [], listName }) {
  return `
    <mj-table padding="0">
      <tr style="text-align:left;padding:16px 0;">
        ${headers
          .map(
            ([varName, label], index) =>
              `
              <th
                style="
                  color: #637381;
                  font-size: 12px;
                  line-height: 32px;
                  white-space: nowrap;
                  font-weight: 400;
                  padding: ${
                    index === headers.length - 1 ? '0 0 0 16px' : '0 16px 0 0'
                  };
                  text-align: ${
                    index === headers.length - 1 ? 'right' : 'left'
                  };
                "
              >
                ${label}
              </th>
            `
          )
          .join('\n')}
      </tr>
      {{#each ${listName}}}
        <tr>
          ${headers
            .map(
              ([varName], index) => `
                <td
                  style="
                    padding: 24px 0;
                    padding-${
                      index === headers.length - 1 ? 'left' : 'right'
                    }: 16px;
                    font-size: 16px;
                    line-height: 32px;
                    white-space: nowrap;
                    font-weight: 300;
                    text-align: ${
                      index === headers.length - 1 ? 'right' : 'left'
                    };
                    border-top: ${index === 0 ? '0' : '1px solid #DDE4E9'};
                    color: #26324E;
                  "
                >
                  {{${varName}}}
                </td>
              `
            )
            .join('\n')}
        </tr>
      {{/each}}
    </mj-table>
  `
}

module.exports = {
  action,
  addressBadge,
  base,
  dataTable,
  infobox,
  link,
}

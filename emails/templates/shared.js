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
              <mj-text line-height="16px">
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
              This service is provided by
              ${link('Aragon One AG', '')}. You are receiving this email because
              you are subscribed to <strong style="font-weight:300;color:#637381">Aragon Court
              Email Notifications</strong>. You can change your email
              ${link('notifications settings', '')} if you not longer wish to
              receive these.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `
}

function link(label, href) {
  return `
      <a href="${href}" style="text-decoration:none;color:#516DFF">${label}</a>
    `.trim()
}

function action(label, href, { padding = '0' } = {}) {
  return `
    <mj-raw>
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
                  display: flex;
                  align-items: center;
                  text-align: center;
                  justify-content: center;
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
    </mj-raw>
  `
}

function infobox({ mode, primary, secondary }) {
  const background = mode === 'negative' ? '#FFE8E8' : '#F9FAFC'
  const icon = mode === 'negative' ? 'icon-negative.png' : 'icon-positive.png'
  const primaryColor = mode === 'negative' ? '#30404F' : '#26C395'
  const secondaryColor = mode === 'negative' ? '#637381' : '#9096B6'
  return `
    <mj-raw>
      <table
        role="presentation"
        cellpadding="0"
        cellspacing="0"
        border="0"
        align="center"
        style="background-color:${background};width:100%;border-radius:4px;font-family:Overpass, sans-serif;"
      >
        <tbody>
          <tr>
            <td style="width:50px;padding:24px;direction:ltr;">
              <img
                alt=""
                width="50"
                height="50"
                src="${ASSETS_URL}/${icon}"
                style="border:0;display:block;outline:none;text-decoration:none;height:50px;width:50px;font-size:16px;"
              />
            </td>
            <td align="left" style="direction:ltr;padding: 24px 0;text-align:left;font-size:16px;color:#9096B6;">
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
                    <td style="direction:ltr;font-size:20px;color:${primaryColor};">
                      ${primary}
                    </td>
                  </tr>
                  <tr>
                    <td height="5"></td>
                  </tr>
                  <tr>
                    <td style="direction:ltr;color:${secondaryColor};">
                      ${secondary}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td style="width:24px;"></td>
          </tr>
        </tbody>
      </table>
    </mj-raw>
  `
}

function dataTable({ headers = [], rows = [] }) {
  return `
    <mj-table padding="0">
      <tr style="text-align:left;padding:16px 0;">
        ${headers.map(
          (header, index) =>
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
                ${header}
              </th>
            `
        )}
      </tr>
      ${rows.map(
        (row, rowIndex) =>
          `
            <tr>
              ${row.map(
                (cell, cellIndex) =>
                  `
                    <td
                      style="
                        font-size: 16px;
                        line-height: 32px;
                        white-space: nowrap;
                        font-weight: 300;
                        text-align: ${
                          cellIndex === row.length - 1 ? 'right' : 'left'
                        };
                        padding: 24px 0;
                        padding-${
                          cellIndex === row.length - 1 ? 'left' : 'right'
                        }: 16px;
                        border-top: ${
                          rowIndex === 0 ? '0' : '1px solid #DDE4E9'
                        };
                        color: #26324E;
                      "
                    >
                      ${cell}
                    </td>
                  `
              )}
            </tr>
          `
      )}
    </mj-table>
  `
}

module.exports = {
  action,
  base,
  dataTable,
  infobox,
  link,
}

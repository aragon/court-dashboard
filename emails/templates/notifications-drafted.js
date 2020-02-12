const mjml2html = require('mjml')

module.exports = function() {
  return mjml2html(
    `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text>
                Hello World!
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `,
    {}
  )
}

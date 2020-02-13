const { addressBadge, dataTable, base, link } = require('./shared')
const { ASSETS_URL } = require('../env')

module.exports = function() {
  const statusOpenDue = `
    <span style="
      display:inline-block;
      width:13px;
      height:13px;
      margin-right:4px;
      border:1.5px solid #F5A623;
      border-radius:2px;
      vertical-align:middle;
    "></span>
  `

  return base({
    title: 'Task Reminder',
    subtitle: `
      Here are the upcoming tasks for the address
      ${addressBadge('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd')}
      on Thursday, 17 Dec, 2019
    `,
    content: `
        <mj-text font-size="16px" line-height="24px" color="#212B36" padding="0 0 40px">
          You have 2 tasks due today:
        </mj-text>

        ${dataTable({
          headers: ['TASK', 'DISPUTE', 'STATUS', 'DUE DATE'],
          rows: [
            [
              'Commit vote',
              link('Dispute #12', ''),
              `${statusOpenDue} Open: Due today`,
              `18 Dec 2019 at 12:46pm`,
            ],
            [
              'Reveal vote',
              link('Dispute #14', ''),
              `${statusOpenDue} Open: Due today`,
              `18 Dec 2019 at 2:50pm`,
            ],
          ],
        })}
      `,
  })
}

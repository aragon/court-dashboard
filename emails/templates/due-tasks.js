const { addressBadge, dataTable, base, link } = require('./shared')
const { ASSETS_URL } = require('../env')

module.exports = function() {
  const clock = `
    <img src="${ASSETS_URL}/clock.png" alt="" width="14" height="14" style="vertical-align: middle;margin-right: 4px;" />
  `
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
              `${clock} 02H : 23M : 52S`,
            ],
            [
              'Reveal vote',
              link('Dispute #14', ''),
              `${statusOpenDue} Open: Due today`,
              `${clock} 06H : 52M : 12S`,
            ],
          ],
        })}
      `,
  })
}

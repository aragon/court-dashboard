const { addressBadge, dataTable, base, link } = require('./shared')
const { accountData } = require('../mock-utils')

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

  return {
    template: base({
      title: 'Task Reminder',
      subtitle: `Here are the tasks for the address ${addressBadge()} on {{date}}`,
      content: `
        <mj-text font-size="16px" line-height="24px" color="#212B36" padding="0 0 40px">
          You have {{tasksCount}} tasks due today:
        </mj-text>

        ${dataTable({
          listName: 'tasks',
          headers: [
            ['name', 'TASK'],
            ['dispute', 'DISPUTE'],
            ['status', 'STATUS'],
            ['dueDate', 'DUE DATE'],
          ],
        })}
      `,
    }),
    mockdata: {
      ...accountData('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd'),
      date: 'Thursday, 17 Dec, 2019',
      disputeId: '14',
      disputeUrl: '',
      // rows: [
      //   [
      //     'Commit vote',
      //     link('Dispute #12', ''),
      //     `${statusOpenDue} Open: Due today`,
      //     `18 Dec 2019 at 12:46pm`,
      //   ],
      //   [
      //     'Reveal vote',
      //     link('Dispute #14', ''),
      //     `${statusOpenDue} Open: Due today`,
      //     `18 Dec 2019 at 2:50pm`,
      //   ],
      // ],
    },
  }
}

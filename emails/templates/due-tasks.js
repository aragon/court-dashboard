const {
  addressBadge,
  base,
  dataTable,
  vspace,
  link,
  style,
} = require('../template-utils')
const { accountData } = require('../mock-utils')

module.exports = function() {
  const statusOpenDue = `
    <span style="${style(`
      display:inline-block;
      width:13px;
      height:13px;
      margin-right:4px;
      border:1.5px solid #F5A623;
      border-radius:2px;
      vertical-align:middle;
    `)}"></span>
  `

  return {
    template: base(
      {
        title: 'Task Reminder',
        subtitle: `Here are the tasks for the address ${addressBadge()} on {{date}}`,
      },
      `
        <div style="font-size:16px;line-height:24px;color:#212B36;">
          You have {{tasksCount}} tasks due today:
        </div>
        ${vspace(40)}

        ${dataTable('tasks', [
          ['{{name}}', 'TASK'],
          [link('Dispute #{{disputeId}}', '{{disputeUrl}}'), 'DISPUTE'],
          ['{{{status}}}', 'STATUS'],
          ['{{dueDate}}', 'DUE DATE'],
        ])}
      `
    ),
    templateText: `
      Aragon Court Notifications

      This service is provided by Aragon One AG [1]. You are receiving this email
      because you are subscribed to Aragon Court Email Notifications. You can
      contact us at support@aragon.org if you not longer wish to receive these.

      [1] https://aragon.one/
    `,
    mockData: {
      ...accountData('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd'),
      date: 'Thursday, 17 Dec. 2019',
      tasksCount: '2',
      tasks: [
        {
          name: 'Commit vote',
          disputeId: '12',
          disputeUrl: 'http://example.org/#12',
          status: `${statusOpenDue} Open: Due today`,
          dueDate: `18 Dec. 2019 at 12:46pm`,
        },
        {
          name: 'Reveal vote',
          disputeId: '14',
          disputeUrl: 'http://example.org/#14',
          status: `${statusOpenDue} Open: Due today`,
          dueDate: `18 Dec. 2019 at 2:50pm`,
        },
      ],
      notificationsSettingsUrl: '',
    },
  }
}

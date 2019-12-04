export const getDummyTasks = () => {
  const task1 = {
    taskName: 'Finish reviewing evidence',
    disputeId: 12,
    priority: 'High',
    juror: '0x593e1F9809658d0c92e9f092cF01Aad7D0d734f3',
    dueDate: 1575391948390,
  }
  const task2 = {
    taskName: 'Reveal vote',
    disputeId: 15,
    priority: 'Medium',
    juror: '0x099278297012066d61c9505132b3Aa71F625E414',
    dueDate: 1575592000000,
  }
  const task3 = {
    taskName: 'Start reviewing evidence',
    disputeId: 20,
    priority: 'Low',
    juror: '0x593e1F9809658d0c92e9f092cF01Aad7D0d734f3',
    dueDate: 1576393000000,
  }
  const task4 = {
    taskName: 'Commit vote',
    disputeId: 14,
    priority: 'Medium',
    juror: '0x099278297012066d61c9505132b3Aa71F625E414',
    dueDate: 1575394000000,
  }

  return [task1, task2, task3, task4]
}

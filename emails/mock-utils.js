function accountData(address) {
  return {
    account: address,
    accountStart: address.slice(0, 6),
    accountEnd: address.slice(-4),
  }
}

module.exports = { accountData }

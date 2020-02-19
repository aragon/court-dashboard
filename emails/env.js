module.exports.ASSETS_URL =
  process.env.ASSETS_URL === undefined ? './assets' : process.env.ASSETS_URL

module.exports.MOCK_DATA =
  process.env.MOCK_DATA !== undefined && process.env.MOCK_DATA !== '0'

module.exports.PRINT_DATA_FOR =
  process.env.PRINT_DATA_FOR === undefined ? null : process.env.PRINT_DATA_FOR

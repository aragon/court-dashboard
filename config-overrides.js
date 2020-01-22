/* config-overrides.js */

const { useBabelRc, override, useEslintRc } = require('customize-cra')

module.exports = override(useBabelRc(), useEslintRc(__dirname + '/.eslintrc'))

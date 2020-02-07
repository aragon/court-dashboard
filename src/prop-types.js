import PropTypes from 'prop-types'

// https://github.com/react-spring/react-spring/blob/31200a79843ce85200b2a7692e8f14788e60f9e9/types/renderprops-universal.d.ts#L133
export const ReactSpringStateType = PropTypes.oneOf([
  'enter',
  'update',
  'leave',
])

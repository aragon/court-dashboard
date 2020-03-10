import PropTypes from 'prop-types'
import { isAddress } from '@aragon/ui'

// https://github.com/react-spring/react-spring/blob/31200a79843ce85200b2a7692e8f14788e60f9e9/types/renderprops-universal.d.ts#L133
export const ReactSpringStateType = PropTypes.oneOf([
  'enter',
  'update',
  'leave',
])

function validatorCreator(nonRequiredFunction) {
  const validator = nonRequiredFunction
  validator.isRequired = (props, propName, componentName) => {
    const value = props[propName]
    if (value === null || value === undefined || value === '') {
      return new Error(
        `Property ${propName} is required on ${componentName}, but ${value} was given.`
      )
    }
    return nonRequiredFunction(props, propName, componentName)
  }
  return validator
}

function ethereumAddressValidator(props, propName, componentName) {
  const value = props[propName]
  if (value === null || value === undefined || value === '') {
    return null
  }
  if (!isAddress(value)) {
    const valueType = typeof value
    let nonAddress = null
    if (valueType !== 'object') {
      nonAddress = value.toString()
    }
    return new Error(
      `Invalid prop ${propName} supplied to ${componentName}. The provided value is not a valid ethereum address.${nonAddress &&
        ` You provided "${nonAddress}"`}`
    )
  }
  return null
}

export const EthereumAddressType = validatorCreator(ethereumAddressValidator)

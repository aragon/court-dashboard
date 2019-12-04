import React from 'react'
import styled from 'styled-components'

function Stepper({ children }) {
  return <Wrapper>{children}</Wrapper>
}

const Wrapper = styled.div`
  & > :not(:last-child)::after {
    position: absolute;
    content: '';
    width: 1px;
    height: 75%;
    background: #8fa4b5;
    top: 50%;
    left: 40px;
    z-index: 1;
  }
`

export default Stepper

import React from 'react'
import styled from 'styled-components'

export default function Step({ children, current }) {
  return <Wrapper current={current}>{children}</Wrapper>
}

const Wrapper = styled.div`
  padding: 15px 20px;
  display: flex;
  align-items: flex-start;
  position: relative;
  background: ${props => (props.current ? '#F9FAFC' : '')};
  transition: background 0.4s ease;
`

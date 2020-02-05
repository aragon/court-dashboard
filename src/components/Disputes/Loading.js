import React from 'react'
import MessageCard from '../MessageCard'
import loadingSVG from '../../assets/Loading.svg'

function Loading({ border }) {
  return <MessageCard icon={loadingSVG} loading border={border} />
}

export default Loading

import React from 'react'
import MessageCard from './MessageCard'
import loadingSVG from '../assets/Loading.svg'

function Loading({ noBorder }) {
  return <MessageCard icon={loadingSVG} loading noBorder={noBorder} />
}

export default Loading

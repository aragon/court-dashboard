import React from 'react'
import { Link } from '@aragon/ui'

import noResults from '../../assets/noResults.svg'
import MessageCard from '../MessageCard'

function NoFilterResults({ onClearFilters }) {
  const title = 'No results found'
  const paragraph =
    'We couldn’t find any dispute matching your filter selection.'

  return (
    <>
      <MessageCard title={title} paragraph={paragraph} icon={noResults} />
      <TextLink text="Clear all filters" onLinkClick={onClearFilters} />
    </>
  )
}

function TextLink({ text, onLinkClick }) {
  return <Link onClick={onLinkClick}>{text}</Link>
}

export default NoFilterResults

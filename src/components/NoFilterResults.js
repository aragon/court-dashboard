import React from 'react'

import noResults from '../assets/noResults.svg'
import MessageCard from './MessageCard'

function NoFilterResults({ onClearFilters, paragraph, noBorder }) {
  const title = 'No results found'

  const link = {
    text: 'Clear all filters',
    action: onClearFilters,
  }

  return (
    <MessageCard
      title={title}
      paragraph={paragraph}
      icon={noResults}
      link={link}
      noBorder={noBorder}
    />
  )
}

export default NoFilterResults

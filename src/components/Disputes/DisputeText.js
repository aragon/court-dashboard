import React from 'react'
import PropTypes from 'prop-types'

// Render a text associated to a dispute.
const DisputeText = ({ text, ...props }) => {
  // If there is no text, the component doesn’t render anything.
  if (!text.trim()) {
    return null
  }

  return (
    <div
      {...props}
      css={`
        // overflow-wrap:anywhere and hyphens:auto are not supported yet by
        // the latest versions of Webkit / Blink (as of October 2019), which
        // is why word-break:break-word has been added here.
        hyphens: auto;
        overflow-wrap: anywhere;
        word-break: break-word;
      `}
    >
      <span>{text}</span>
    </div>
  )
}

DisputeText.propTypes = {
  text: PropTypes.string,
}

DisputeText.defaultProps = {
  text: '',
}

export default DisputeText

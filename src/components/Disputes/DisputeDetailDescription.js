import React from 'react'
import { GU, useTheme } from '@aragon/ui'
import IdentityBadge from '../IdentityBadge'

function DisputeDetailDescription({ path }) {
  return (
    <div
      css={`
        // overflow-wrap:anywhere and hyphens:auto are not supported yet by
        // the latest versions of Safari (as of June 2020), which
        // is why word-break:break-word has been added here.
        hyphens: auto;
        overflow-wrap: anywhere;
        word-break: break-word;
      `}
    >
      {path
        ? path.map((step, index) => <DescriptionStep key={index} step={step} />)
        : ''}
    </div>
  )
}

function DescriptionStep({ step }) {
  const theme = useTheme()

  const description = []

  // Add app
  description.push(
    <React.Fragment key={0}>
      {step.appName || (
        <IdentityBadge
          compact
          entity={step.to}
          css={`
            padding-right: 0;
          `}
        />
      )}
      <span> : </span>
    </React.Fragment>
  )

  if (step.descriptionAnnotated) {
    description.push(
      step.descriptionAnnotated.map(({ type, value }, index) => {
        // The app has already been pushed as the first element, so we increment the index by 1 for
        // these keys
        const key = index + 1

        if (type === 'address' || type === 'any-account') {
          return (
            <span key={key}>
              <IdentityBadge
                compact
                entity={type === 'any-account' ? 'Any account' : value}
              />
            </span>
          )
        }

        if (type === 'app') {
          return (
            <IdentityBadge
              compact
              entity={type === 'any-account' ? 'Any account' : value.address}
            />
          )
        }

        return <span key={key}> {value.description || value}</span>
      })
    )
  } else {
    description.push(
      <span key={description.length + 1}>
        {step.description || 'No description'}
      </span>
    )
  }
  description.push(<br key={description.lenth + 1} />)

  const childrenDescriptions = (step.children || []).map((child, index) => {
    return <DescriptionStep step={child} key={index} />
  })

  return (
    <>
      <span>{description}</span>
      {childrenDescriptions.length > 0 && (
        <ul
          css={`
            list-style-type: none;
            margin-left: 0;
            padding-left: ${0.5 * GU}px;
            text-indent: -${0.5 * GU}px;
          `}
        >
          <li
            css={`
              padding-left: ${2 * GU}px;
              &:before {
                content: '';
                width: ${0.5 * GU}px;
                height: ${0.5 * GU}px;
                background: ${theme.accent};
                border-radius: 50%;
                display: inline-block;
              }
              span {
                display: inline;
                color: ${theme.surfaceContentSecondary};
              }
            `}
          >
            {childrenDescriptions}
          </li>
        </ul>
      )}
    </>
  )
}

export default DisputeDetailDescription

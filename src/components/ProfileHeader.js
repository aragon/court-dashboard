import React from 'react'
import styled from 'styled-components'

import { Button, GU, textStyle, useViewport } from '@aragon/ui'

import ProfileIcon from '../assets/profile.png'
import ANJProfileIcon from '../assets/anj-active.svg'
import IconCheck from '../assets/IconCheck.svg'

import Balances from './Balances/Balances'

export default function ProfileHeader({ active }) {
  const { below } = useViewport()
  return (
    <Wrapper>
      <div
        css={`
          margin-bottom: ${3 * GU}px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
          `}
        >
          <div
            css={`
              position: relative;
              margin-right: ${3 * GU}px;
            `}
          >
            <img alt="profile" src={ProfileIcon} />
            <img
              alt="active-juror"
              src={ANJProfileIcon}
              css="position: absolute; top: 0; right: -5px"
            />
          </div>
          <div>
            <div
              css={`
                margin-bottom: ${1 * GU}px;
                display: flex;
                align-items: center;
              `}
            >
              <span
                css={`
                  ${textStyle('title4')}
                  color: #212B36;
                  font-weight: 200;
                  letter-spacing: 1px;
                  margin-right: ${2 * GU}px;
                `}
              >
                Eliza Stewart
              </span>
              {active && (
                <div
                  css={`
                    display: flex;
                    align-items: center;
                  `}
                >
                  <img
                    alt="active"
                    src={IconCheck}
                    css={`
                      margin-right: 4px;
                    `}
                  />
                  <span
                    css={`
                      ${textStyle('label2')}
                      color: #637381;
                      font-weight: 200;
                    `}
                  >
                    ACTIVE JUROR
                  </span>
                </div>
              )}
            </div>
            <div>
              <p
                css={`
                  ${textStyle('body3')}
                  color: #212B36;
                  font-weight: 200;
                `}
              >
                You are active and eligible to be drafted starting from the next
                term, on 14/12/19 at 16:00.
              </p>
            </div>
          </div>
        </div>
        {!below('medium') && (
          <div>
            <Button>
              <span
                css={`
                  color: #636971;
                `}
              >
                View profile
              </span>
            </Button>
          </div>
        )}
      </div>
      <Balances />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: white;
  border: 1px solid #dde4e9;
  margin-top: 30px;
  padding: 36px;
`

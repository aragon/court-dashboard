import React, { useCallback } from 'react'
import {
  Box,
  Button,
  GU,
  IconMail,
  IconTrash,
  Info,
  Link,
  Switch,
  useTheme,
  Split,
  Tag,
  textStyle,
} from '@aragon/ui'

import emailNotifcationIllustration from '../../../../src/assets/emailNotifications.svg'

export default function NotificationsPreferences({
  email,
  notificationsDisabled,
  onSwitchNotificationsStatus,
  onLockSettings,
  onDeleteEmail,
  onUpdateEmail,
}) {
  const theme = useTheme()

  return (
    <React.Fragment>
      <Split
        primary={
          <EmailNotificationBox
            notificationsDisabled={notificationsDisabled}
            onSwitchNotificationsStatus={onSwitchNotificationsStatus}
          />
        }
        secondary={
          <React.Fragment>
            <Box heading="Email account">
              <Tag
                uppercase={false}
                background={theme.infoSurface}
                size="normal"
                color={theme.content}
                css={`
                  ${textStyle('body2')};
                  border-radius: 3px;
                `}
              >
                {email}
              </Tag>
              <Button
                css={`
                  margin-top: ${2 * GU}px;
                `}
                wide
                mode="strong"
                onClick={onLockSettings}
              >
                Lock settings
              </Button>
              <Button
                css={`
                  margin-top: ${2 * GU}px;
                  justify-content: left;
                `}
                wide
                onClick={onUpdateEmail}
              >
                <IconMail />
                Update email
              </Button>
              <Button
                css={`
                  margin-top: ${2 * GU}px;
                  justify-content: left;
                `}
                wide
                onClick={onDeleteEmail}
              >
                <IconTrash
                  css={`
                    color: ${theme.negative};
                  `}
                />
                Delete your email
              </Button>
              <Info
                css={`
                  margin-top: ${2 * GU}px;
                `}
              >
                Learn more about our{' '}
                <Link href="https://aragon.one/email-collection.md">
                  Email collection policy
                </Link>
                .
              </Info>
            </Box>
          </React.Fragment>
        }
      />
    </React.Fragment>
  )
}

function EmailNotificationBox({
  notificationsDisabled,
  onSwitchNotificationsStatus,
}) {
  const handleSwitchNotificationsStatus = useCallback(() => {
    onSwitchNotificationsStatus(!notificationsDisabled)
  }, [notificationsDisabled, onSwitchNotificationsStatus])

  return (
    <Box heading="Signed In With Email">
      <div
        css={`
          display: flex;
          flex-direction: column;
          text-align: center;
        `}
      >
        <div>
          <img
            src={emailNotifcationIllustration}
            width={180}
            height={180}
            alt=""
          />
        </div>
        <div
          css={`
            display: flex;
            margin-top: ${5 * GU}px;
            align-items: center;
          `}
        >
          <Switch
            checked={!notificationsDisabled}
            onChange={handleSwitchNotificationsStatus}
          />
          <span
            css={`
              ${textStyle('body1')};
              margin-left: ${GU}px;
            `}
          >
            Receive email notifications for all Aragon Court events.
          </span>
        </div>
        <Info
          css={`
            margin-top: ${2 * GU}px;
          `}
          mode={notificationsDisabled ? 'warning' : 'info'}
        >
          {notificationsDisabled
            ? `We strongly advise you to turn on these notifications. 
            By turning off these email alerts, we won’t notify you whenever you are drafted to arbitrate a dispute or 
            if you have any upcoming tasks. Failure to complete your jury duties will result in monetary penalties. `
            : `We will timely notify you whenever you are drafted to arbitrate a
          dispute, if you have any upcoming tasks and when you can start
          claiming your rewards.`}
        </Info>
      </div>
    </Box>
  )
}

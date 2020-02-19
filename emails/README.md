# Emails

Email notification templates for use with Aragon Court (may be moved in the future to where the notification service lives).

Currently intended for use through any [Mustache](https://mustache.github.io/) compatible email service, including [Postmark](https://postmarkapp.com/).

## Generating templates

Install the dependencies in this directory via `yarn`, and then generate templates with `yarn build`.

To test each template, mock data has been included and fully rendered emails can be generated with `yarn build:mock`.

Two outputs are generated per template: one `.html` and one `.txt`. If the email service supports it, you should include both versions.

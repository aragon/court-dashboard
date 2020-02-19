# Emails

Email notification templates for use with Aragon Court (may be moved in the future to where the notification service lives).

Currently intended for use through any [Mustache](https://mustache.github.io/) compatible email service, including [Postmark](https://postmarkapp.com/).

## Generating templates

Install the dependencies in this directory via `yarn`, and then generate templates with `yarn build`.

To test each template, mock data has been included and fully rendered emails can be generated with `yarn build:mock`.

Two outputs are generated per template: one `.html` and one `.txt`. If the email service supports it, you should include both versions.

## Environment variables

### ASSETS_URL

Set this to the base URL of the assets. Defaults to `./assets`.

### MOCK_DATA

Set this to `1` to replace the mustache variables by the `mockData` provided in the template.

### PRINT_DATA_FOR

Set this to the name of the template you want to extract the data for. This is useful to generate the Postmark request that will fill the corresponding template.

## Examples

To develop or test (e.g. on Litmus), use the `build:mock` script:

```console
yarn build:mock
```

When used with Litmus, remember to change the `ASSETS_URL` variable.

### Update Postmark templates

Use `build:postmark` to get this variable set on the URLs used with our Postmark templates:

```console
yarn build:postmark
```

After running this command, the genertaed .html and .txt templates are ready to be used on Postmark.

Use `PRINT_DATA_FOR` to get the data corresponding to a template:

```console
PRINT_DATA_FOR=generic yarn build
```

# Emails

## How to build

Build the email templates:

```console
yarn build
```

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

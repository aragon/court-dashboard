export function validateEmail(email) {
  // eslint-disable-next-line no-useless-escape
  return /^.+\@.+\..+$/.test(email)
}

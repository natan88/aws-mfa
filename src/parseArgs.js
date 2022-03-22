import arg from 'arg'

export function parseArgumentsIntoOptions (rowArgs) {
  const args = arg({
    '--mfa': String,
    '--setup': Boolean,
    '--profile': String
  }, {
    argv: rowArgs.slice(2)
  })
  return {
    setup: args['--setup'] || false,
    mfa: args['--mfa'] || 0,
    profile: args['--profile'] || 'default'
  }
}

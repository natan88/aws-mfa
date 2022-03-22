import { Configuration } from './configuration'
import { parseArgumentsIntoOptions } from './parseArgs'
import { Authenticate } from './authenticate'

export async function cli (args, version) {
  try {
    const options =  parseArgumentsIntoOptions(args)
    const configuration = new Configuration()

    if (options.setup) {
      delete options.setup
      await configuration.configure(options)
      return
    }

    const config = configuration.getConfiguration(options.profile)
    if (!config) {
      console.log('Error on read configuration')
      return
    }

    Authenticate.auth(config.serialNumber, options.mfa, config.duration, config.profile)
  } catch (error) {
    console.error('Error: ', error.message)
  }
}

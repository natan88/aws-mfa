import inquirer from 'inquirer'
import fs from 'fs'
const homedir = require('os').homedir()
const path = require('path')

export class Configuration {
  DURATION_DEFAULT = 86400
  PROFILE_DEFAULT = 'default'
  REGION_DEFAULT = 'us-east-1'
  ourPath
  ourConfigFile

  constructor () {
    const ourFolder = '.aws-mfa'
    this.ourPath = path.join(homedir, ourFolder)
    this.ourConfigFile = path.join(this.ourPath, 'config.json')
  }

  async configure (options) {
    const params = await this.gerParams()
    if (!params.serialNumber) {
      console.error('serialNumber is required')
      return
    }
    const currentConfiguration = this.getConfiguration() || {}
    const profile = params.profile
    delete params.profile
    currentConfiguration[profile] = { ...params }
    this.storeConfiguration(currentConfiguration)
  }

  async storeConfiguration (configuration) {
    if (!fs.existsSync(this.ourPath)) fs.mkdirSync(this.ourPath)
    fs.writeFileSync(this.ourConfigFile, JSON.stringify(configuration, null, 2), { encoding: 'utf8' })
  }

  getConfiguration (profile) {
    try {
      const config = JSON.parse(fs.readFileSync(this.ourConfigFile, 'utf-8'))
      if (!profile) return config
      return config[profile]
    } catch (error) {
      return null
    }
  }

  async gerParams (options) {
    const questions = [
      {
        type: 'input',
        name: 'serialNumber',
        message: 'Serial number: '
      },
      {
        type: 'input',
        name: 'profile',
        message: 'Profile: ',
        default: this.PROFILE_DEFAULT
      },
      {
        type: 'number',
        name: 'duration',
        message: 'Duration (in seconds):',
        default: this.DURATION_DEFAULT
      },
      {
        type: 'input',
        name: 'region',
        message: 'Region:',
        default: this.REGION_DEFAULT
      }
    ]

    const params = await inquirer.prompt(questions, options);
    return params
  }
}
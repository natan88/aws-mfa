const shell = require('shelljs')
import fs from 'fs'
const homedir = require('os').homedir()
const path = require('path')

export class Authenticate {

  static awsFolder = '.aws'
  static awsFileName = 'credentials'
  static awsCredentialsFullPath = path.join(homedir, Authenticate.awsFolder, Authenticate.awsFileName)

  static getAwsVersion () {
    const result = shell.exec('aws --version')
    if (!result.stdout) return null
    return result.stdout
  }

  static auth (serialNumber, codeMfa, duration = 86400, profile = 'default') {
    const credentials = Authenticate.getCredentialsInAws(serialNumber, codeMfa, duration, profile)
    Authenticate.exportEnvs(credentials, profile)
  }

  static getCredentialsInAws (serialNumber, codeMfa, duration, profile) {
    const result = shell.exec(`aws sts get-session-token --duration-seconds ${duration} --profile ${profile} --serial-number ${serialNumber} --token-code ${codeMfa} --output json`)
    if (result.stderr || !result.stdout) process.exit(1)
    const envs = JSON.parse(result.stdout.trim())
    return envs.Credentials
  }

  static exportEnvs (credentials, profile) {
    if (!credentials) {
      process.exit(1)
    }

    const contentCredentials = `[default]
    aws_access_key_id = ${credentials.AccessKeyId}
    aws_secret_access_key = ${credentials.SecretAccessKey}
    aws_session_token = ${credentials.SessionToken}}
    #expiry ${credentials.Expiration}`

    fs.writeFileSync(Authenticate.awsCredentialsFullPath, contentCredentials, { encoding: 'utf8' })
  }
}

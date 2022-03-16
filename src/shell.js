const shell = require('shelljs')

export class Shell {

  static getAwsVersion () {
    const result = shell.exec('aws --version')
    if (!result.stdout) return null
    return result.stdout
  }

  static auth (serialNumber, codeMfa, duration = 86400, profile = 'default') {
    const credentials = Shell.getCredentialsInAws(serialNumber, codeMfa, duration, profile)
    Shell.exportEnvs(credentials)
  }

  static getCredentialsInAws (serialNumber, codeMfa, duration, profile) {
    const result = shell.exec(`aws sts get-session-token --duration-seconds ${duration} --profile ${profile} --serial-number ${serialNumber} --token-code ${codeMfa}`)
    if (result.stderr || !result.stdout) return
    const envs = JSON.parse(result.stdout.trim())
    return envs.Credentials
  }

  static exportEnvs (credentials) {
    shell.exec(`export AWS_ACCESS_KEY_ID=${credentials.AccessKeyId}`)
    shell.exec(`export AWS_SECRET_ACCESS_KEY=${credentials.SecretAccessKey}`)
    shell.exec(`export AWS_SESSION_TOKEN=${credentials.SessionToken}`)
  }
}

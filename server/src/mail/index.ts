import { MAIL_DRIVER } from '~environment'

const mailDriver: () => MailerFunction = () => {
  if (MAIL_DRIVER === 'sendgrid') return require('./sendgrid').default
  else return require('./log').default
}

export default mailDriver
export * from './utils'

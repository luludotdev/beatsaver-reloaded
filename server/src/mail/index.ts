import { MAIL_DRIVER } from '../env'

const mailDriver: () => MailerFunction = () => {
  if (MAIL_DRIVER === 'smtp') return require('./smtp').default
  else return require('./log').default
}

export default mailDriver

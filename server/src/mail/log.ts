import { MAIL_FROM } from '../env'
import signale from '../utils/signale'

const logDriver: MailerFunction = async (to, subject, body) => {
  const lines = [
    '-----------------',
    `FROM:\t${MAIL_FROM}`,
    `TO:\t\t${to}`,
    `SUBJECT:\t${subject}`,
    'BODY:',
    ...body.split('\n'),
    '-----------------',
  ]

  for (const line of lines) {
    signale.log(line)
  }
}

export default logDriver

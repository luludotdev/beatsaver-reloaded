import mail from '@sendgrid/mail'
import { MAIL_FROM, SENDGRID_KEY } from '~environment'

mail.setApiKey(SENDGRID_KEY)

const smtpDriver: MailerFunction = async (to, subject, body) => {
  await mail.send({ from: MAIL_FROM, to, subject, text: body })
}

export default smtpDriver

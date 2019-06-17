type MailerFunction = (
  to: string,
  subject: string,
  body: string
) => Promise<void>

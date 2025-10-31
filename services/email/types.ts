export interface SendEmailOptions {
  from: string
  to: string
  subject: string
  html: string
  text?: string
}

export interface EmailProvider {
  sendEmail(options: SendEmailOptions): Promise<void>
}



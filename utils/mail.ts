import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export const sendVerificationEmail = async (to: string, token: string) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`
  
  await transporter.sendMail({
    from: process.env.VERIFICATION_EMAIL,
    to: to,
    subject: 'E-posta Adresinizi Doğrulayın',
    html: `
      <h1>E-posta Doğrulama</h1>
      <p>E-posta adresinizi doğrulamak için aşağıdaki bağlantıya tıklayın:</p>
      <a href="${verificationUrl}">E-postamı Doğrula</a>
    `
  })
}

export const sendNotificationEmail = async (to: string, subject: string, message: string) => {
  await transporter.sendMail({
    from: process.env.NOTIFICATION_EMAIL,
    to: to,
    subject: subject,
    html: message
  })
} 
"use server"

import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendVerificationEmail(email: string, verificationToken: string) {
  try {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${verificationToken}`

    const info = await transporter.sendMail({
      from: `"Görev Planlayıcı" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Email Adresinizi Doğrulayın",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Email Doğrulama</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Merhaba,<br><br>
            Görev Planlayıcı hesabınızı doğrulamak için aşağıdaki butona tıklayın:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #0070f3; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; font-weight: bold;">
              Hesabımı Doğrula
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Eğer buton çalışmazsa, aşağıdaki linki tarayıcınıza kopyalayabilirsiniz:<br>
            <a href="${verificationUrl}" style="color: #0070f3;">${verificationUrl}</a>
          </p>
        </div>
      `,
    })

    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Email sending failed:", error)
    return { success: false, error }
  }
}

export async function sendTaskNotification(email: string, task: any) {
  try {
    const info = await transporter.sendMail({
      from: `"Görev Planlayıcı" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Görev Hatırlatması: ${task.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Görev Hatırlatması</h1>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
            <h2 style="color: #0070f3; margin-top: 0;">${task.title}</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              <strong>Tarih:</strong> ${task.date}<br>
              <strong>Saat:</strong> ${task.time}<br>
              <strong>Tür:</strong> ${task.type}<br>
              ${task.description ? `<strong>Açıklama:</strong> ${task.description}` : ""}
            </p>
          </div>
        </div>
      `,
    })

    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Notification email sending failed:", error)
    return { success: false, error }
  }
}


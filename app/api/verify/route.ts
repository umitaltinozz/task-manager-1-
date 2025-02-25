import { NextResponse } from 'next/server'
import { sendNotificationEmail } from '@/utils/mail'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()
    
    // Token doğrulaması burada yapılacak
    // ...

    // Doğrulama başarılı olduğunda bildirim gönder
    await sendNotificationEmail(
      process.env.NOTIFICATION_EMAIL!,
      'Yeni E-posta Doğrulaması',
      'Bir kullanıcı e-posta adresini doğruladı.'
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Doğrulama hatası' }, { status: 500 })
  }
} 
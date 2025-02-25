import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyNoticePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Email Doğrulama</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Email adresinize doğrulama bağlantısı gönderildi. Lütfen email adresinizi kontrol edin ve hesabınızı
            doğrulayın.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}


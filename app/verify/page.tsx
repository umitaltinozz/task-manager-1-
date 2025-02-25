"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get("token")
        if (!token) throw new Error("Geçersiz doğrulama bağlantısı")

        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const userIndex = users.findIndex((u: any) => u.verificationToken === token)

        if (userIndex === -1) throw new Error("Geçersiz veya süresi dolmuş doğrulama bağlantısı")

        // Kullanıcıyı doğrula
        users[userIndex].isVerified = true
        delete users[userIndex].verificationToken

        localStorage.setItem("users", JSON.stringify(users))

        toast({
          title: "Başarılı",
          description: "Email adresiniz başarıyla doğrulandı. Giriş yapabilirsiniz.",
        })

        // 2 saniye sonra login sayfasına yönlendir
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } catch (error) {
        toast({
          title: "Hata",
          description: error instanceof Error ? error.message : "Email doğrulama başarısız oldu.",
          variant: "destructive",
        })
        // 2 saniye sonra login sayfasına yönlendir
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } finally {
        setVerifying(false)
      }
    }

    verifyEmail()
  }, [router, searchParams, toast])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Email Doğrulama</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {verifying ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Email adresiniz doğrulanıyor...</p>
            </>
          ) : (
            <p>Yönlendiriliyorsunuz...</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


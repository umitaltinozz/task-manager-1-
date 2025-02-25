"use client"

import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import type { FC } from "react"

const VerifyPage: FC = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [verified, setVerified] = useState(false)

  const handleVerify = async () => {
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      })

      if (response.ok) {
        setVerified(true)
      }
    } catch (error) {
      console.error('Doğrulama hatası:', error)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1>E-posta Doğrulama</h1>
      {verified ? (
        <p>E-posta adresiniz başarıyla doğrulandı!</p>
      ) : (
        <Button onClick={handleVerify}>E-postamı Doğrula</Button>
      )}
    </div>
  )
}

export default VerifyPage 
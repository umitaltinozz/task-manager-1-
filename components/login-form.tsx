"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "./auth-provider"

const formSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
})

export function LoginForm() {
  const router = useRouter()
  const { dispatch } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)

      const savedUsers = JSON.parse(localStorage.getItem("users") || "[]")
      const user = savedUsers.find((u: any) => u.email === values.email && u.password === values.password)

      if (!user) {
        throw new Error("Email veya şifre hatalı")
      }

      if (!user.isVerified) {
        throw new Error("Lütfen önce email adresinizi doğrulayın")
      }

      dispatch({ type: "LOGIN", user })

      toast({
        title: "Başarılı",
        description: "Giriş yapıldı",
      })

      // Yönlendirmeyi geciktir
      setTimeout(() => {
        router.push(`/${new Date().toISOString().slice(0, 10)}`)
      }, 1000)
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Giriş yapılamadı",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Giriş Yap</CardTitle>
        <CardDescription>Görev yönetim sistemine hoş geldiniz</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="ornek@mail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şifre</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Hesabınız yok mu?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Kayıt ol
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}


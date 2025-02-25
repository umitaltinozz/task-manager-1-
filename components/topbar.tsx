"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-provider"

export function Topbar() {
  const router = useRouter()
  const { state, dispatch } = useAuth()

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" })
    router.push("/login")
  }

  if (!state.isAuthenticated) return null

  return (
    <div className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Görev Planlayıcı
          </Link>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="text-sm">{state.user?.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


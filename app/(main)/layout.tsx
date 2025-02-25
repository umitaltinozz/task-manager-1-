import type React from "react"
import { Navigation } from "@/components/navigation"
import { Topbar } from "@/components/topbar"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      <Navigation />
      <main className="container mx-auto py-4">{children}</main>
    </div>
  )
}


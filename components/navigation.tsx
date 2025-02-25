"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Calendar, LayoutGrid, LineChart, ListTodo, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { useAuth } from "./auth-provider"

const today = new Date()
  .toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
  })
  .replace("/", ".")

const navigation = [
  {
    title: "Günlük",
    href: `/dashboard/${today}`,
    icon: ListTodo,
  },
  {
    title: "Haftalık",
    href: "/dashboard/weekly",
    icon: LayoutGrid,
  },
  {
    title: "Aylık",
    href: "/dashboard/monthly",
    icon: Calendar,
  },
  {
    title: "Konular",
    href: "/dashboard/topics",
    icon: ListTodo,
  },
  {
    title: "İstatistikler",
    href: "/dashboard/stats",
    icon: LineChart,
  },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { state, dispatch } = useAuth()

  if (!state.isAuthenticated) return null

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" })
    router.push("/login")
  }

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (pathname.startsWith("/dashboard/") &&
                  item.href.startsWith("/dashboard/") &&
                  pathname.split("/")[2] === item.href.split("/")[2])

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md",
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">{state.user?.name}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}


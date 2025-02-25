import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default function HomePage() {
  const cookieStore = cookies()
  const user = cookieStore.get("user")

  if (!user) {
    redirect("/login")
  }

  const today = new Date()
    .toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
    })
    .replace("/", ".")

  redirect(`/dashboard/${today}`)
}


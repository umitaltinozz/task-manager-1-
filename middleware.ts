import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicRoutes = ["/login", "/register", "/verify", "/verify-notice"]

export function middleware(request: NextRequest) {
  const user = request.cookies.get("user")
  const path = request.nextUrl.pathname
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route))

  // Kullanıcı giriş yapmamışsa ve public olmayan bir sayfaya erişmeye çalışıyorsa
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Kullanıcı giriş yapmışsa ve public bir sayfaya erişmeye çalışıyorsa
  if (user && isPublicRoute) {
    const today = new Date()
      .toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
      })
      .replace("/", ".")

    return NextResponse.redirect(new URL(`/dashboard/${today}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}


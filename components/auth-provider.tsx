"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { User } from "@/lib/types"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

type AuthAction = { type: "LOGIN"; user: User } | { type: "LOGOUT" } | { type: "REGISTER"; user: User }

const AuthContext = createContext<{
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
} | null>(null)

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.user))
        document.cookie = `user=${JSON.stringify(action.user)}; path=/`
      }
      return {
        user: action.user,
        isAuthenticated: true,
      }
    case "LOGOUT":
      if (typeof window !== "undefined") {
        localStorage.removeItem("user")
        document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      }
      return {
        user: null,
        isAuthenticated: false,
      }
    case "REGISTER":
      return {
        user: action.user,
        isAuthenticated: false,
      }
    default:
      return state
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user")
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser)
          if (user.isVerified) {
            dispatch({ type: "LOGIN", user })
          }
        } catch (error) {
          console.error("Error loading user from localStorage:", error)
        }
      }
    }
  }, [])

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


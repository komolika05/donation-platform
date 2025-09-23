"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import api from "@/lib/api"
import toast from "react-hot-toast"
import type { User, AuthContextType, RegisterData } from "@/types"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("jkvis_token")
    const storedUser = localStorage.getItem("jkvis_user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      // Verify token is still valid
      verifyToken()
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async () => {
    try {
      const response = await api.get("/auth/me")
      if (response.data.success) {
        setUser(response.data.data.user)
      } else {
        logout()
      }
    } catch (error) {
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await api.post("/auth/login", { email, password })

      if (response.data.success) {
        const { user: userData, token: userToken } = response.data.data

        setUser(userData)
        setToken(userToken)

        localStorage.setItem("jkvis_token", userToken)
        localStorage.setItem("jkvis_user", JSON.stringify(userData))

        toast.success("Login successful!")
      }
    } catch (error: any) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true)
      const response = await api.post("/auth/register", userData)

      if (response.data.success) {
        const { user: newUser, token: userToken } = response.data.data

        setUser(newUser)
        setToken(userToken)

        localStorage.setItem("jkvis_token", userToken)
        localStorage.setItem("jkvis_user", JSON.stringify(newUser))

        toast.success("Registration successful!")
      }
    } catch (error: any) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("jkvis_token")
    localStorage.removeItem("jkvis_user")
    toast.success("Logged out successfully")
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

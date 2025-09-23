"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import toast from "react-hot-toast"

const schema = yup.object({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().required("Password is required"),
})

type LoginFormData = yup.InferType<typeof schema>

export function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      await login(data.email, data.password)
      router.push("/dashboard")
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed"
      toast.error(message)
      setError("root", { message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        type="email"
        placeholder="Email address"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      {errors.root && <div className="text-sm text-red-600 text-center">{errors.root.message}</div>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}

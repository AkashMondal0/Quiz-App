"use client"

import { useForm } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import axios from "axios"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { toast } from "sonner"
import {appInfo} from "@/config/app-details";

const FormSchema = z.object({
  username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters." })
      .max(32, { message: "Username must be 32 characters or fewer." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
})

type FormData = z.infer<typeof FormSchema>

export default function SignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)
      await axios.post(
          appInfo.apiUrl+"/auth/register",
          {
            username: data.username,
            email: data.email,
            password: data.password,
            roles: ["ROLE_USER"],
          },
          { withCredentials: true },
      )
      toast.success("Account created!", {
        description: "You can log in now.",
      })
      reset();
      location.reload();
    } catch (error: any) {
      toast("Signup failed: " + (error.response?.data?.message || "Unknown error"), {
        description: "Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className={cn("flex flex-col gap-6")}>
            <Card>
              <CardHeader>
                <CardTitle>Create a new account</CardTitle>
                <CardDescription>Enter your details to sign up</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-6">
                    {/* Username */}
                    <div className="grid gap-3">
                      <Label htmlFor="username">Username</Label>
                      <Input
                          id="username"
                          placeholder="Enter your username"
                          {...register("username", { required: "Username is required" })}
                      />
                      {errors.username && (
                          <p className="text-sm text-red-500">{errors.username.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="grid gap-3">
                      <Label htmlFor="email">Email</Label>
                      <Input
                          id="email"
                          type="email"
                          placeholder="example@example.com"
                          {...register("email", { required: "Email is required" })}
                      />
                      {errors.email && (
                          <p className="text-sm text-red-500">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="grid gap-3">
                      <Label htmlFor="password">Password</Label>
                      <Input
                          id="password"
                          type="password"
                          {...register("password", { required: "Password is required" })}
                      />
                      {errors.password && (
                          <p className="text-sm text-red-500">{errors.password.message}</p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-3">
                      <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
                        {isSubmitting ? "Signing up..." : "Sign up"}
                      </Button>
                      <Button variant="outline" className="w-full cursor-pointer" type="button">
                        Sign up with Google
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="underline underline-offset-4">
                      Log in
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}

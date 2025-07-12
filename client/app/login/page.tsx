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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react"
import { toast } from "sonner"
import {appInfo} from "@/config/app-details";

const FormSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
});

type FormData = z.infer<typeof FormSchema>;

export default function Page() {

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleSubmit, register, reset, formState: { errors } } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await axios.post(appInfo.apiUrl+"/auth/login", {
        email: data.email,
        password: data.password,
      }, {
        withCredentials: true,
      })
      toast.success("Login successful!",{
        description: "You will be redirected shortly.",
      });
      reset();
      location.reload();
    } catch (error: any) {
      toast("Login failed: " + (error.response?.data?.message || "Unknown error"), {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message as string}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      {...register("password", { required: "Password is required" })}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">
                        {errors.password.message as string}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
                      {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                    <Button variant="outline" className="w-full cursor-pointer" type="button">
                      Login with Google
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="underline underline-offset-4">
                    Sign up
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

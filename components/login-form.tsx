"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import {  useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import  GoogleIcon  from '@/data/icons'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FieldError } from "@/components/ui/field"
import { login } from "@/app/api/auth/login/login"
import { loginFormSchema } from "@/app/zod_validation/auth_validation"
import { toast } from "sonner"
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })


  const signInWithGoogle = async () => {
    setLoading(true);
    const data = await authClient.signIn.social({
      provider: "google",
      callbackURL: '/redirecting',
    });
  };

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setLoading(true);
    const {success, message} = await login(values.email, values.password);
    if (success) {
        toast.success(message)
        router.push('/redirecting')
    } else {
      toast.error(message)
    }
    setLoading(false);
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" {...form.register("email")} />
          <FieldError errors={[{ message: form.formState.errors.email?.message }]} />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="/forget-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" {...form.register("password")} />
          <FieldError errors={[{ message: form.formState.errors.password?.message }]} />
        </Field>
        <Field>
          <Button type="submit" disabled={isLoading}> {isLoading ? "Logging in ..." : "Login" }</Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button variant="outline" type="button" onClick={signInWithGoogle} disabled={isLoading}>
            <GoogleIcon/>
            Login with Google
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="underline underline-offset-4">
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}

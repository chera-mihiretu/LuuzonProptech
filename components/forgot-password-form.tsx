"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import {  useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FieldError } from "@/components/ui/field"
import { forgetPasswordSchema } from "@/app/zod_validation/auth_validation"
import { toast } from "sonner"
import { useState } from "react";
import { forgetPassword } from "@/app/api/auth/reset-password/forget-password";
import MY_ROUTES from "@/data/routes";
export function ForgetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isLoading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof forgetPasswordSchema>>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    }
  })

  async function onSubmit(values: z.infer<typeof forgetPasswordSchema>) {
    setLoading(true);
    const {success, message} = await forgetPassword(values.email, MY_ROUTES.resetPassword);
    if (success) {
        toast.success(message)
    } else {
      toast.error(message)
    }
    setLoading(false);
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Forget Password ?</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to reset your password
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" {...form.register("email")} />
          <FieldError errors={[{ message: form.formState.errors.email?.message }]} />
        </Field>
        <Field>
          <Button type="submit" disabled={isLoading}> {isLoading ? "Reseting ..." : "Reset Password" }</Button>
        </Field>
        <FieldDescription className="text-center">
            Go back to?{" "}
            <a href={MY_ROUTES.login} className="underline underline-offset-4">
              log in
            </a>
          </FieldDescription>

      </FieldGroup>
    </form>
  )
}


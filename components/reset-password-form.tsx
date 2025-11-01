"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import {  useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FieldError } from "@/components/ui/field"
import { resetPasswordSchema } from "@/app/zod_validation/auth_validation"
import { toast } from "sonner"
import { useState } from "react";
import { resetPassword } from "@/app/api/auth/reset-password/reset-password";
import { useSearchParams } from "next/navigation";
import MY_ROUTES from "@/data/routes";
export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") as string;
  const [isLoading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confrimPassword: ""
    }
  })

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    setLoading(true);
    if (!token) {
        setLoading(false);
        toast.error('You are performing an authorized action');
        return;
    }
    const {success, message} = await resetPassword(values.password, token);
    if (success) {
        toast.success(message)
        router.push(MY_ROUTES.login)
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
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" type="password"  {...form.register("password")} />
          <FieldError errors={[{ message: form.formState.errors.password?.message }]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <Input id="confirmPassword" type="password"  {...form.register("confrimPassword")} />
          <FieldError errors={[{ message: form.formState.errors.confrimPassword?.message }]} />
        </Field>
        <Field>
          <Button type="submit" disabled={isLoading}> {isLoading ? "Reseting ..." : "Reset Password" }</Button>
        </Field>

      </FieldGroup>
    </form>
  )
}


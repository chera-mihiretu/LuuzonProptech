"use client";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import {  useForm } from "react-hook-form"
import {  z } from "zod";
import {  tenantRegistrationFormSchema } from "@/app/zod_validation/auth_validation"; 
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerUserEmail } from "@/app/api/auth/register/register";
import { toast } from "sonner";
import MY_ROUTES from "@/data/routes";



export function CompleteProfileForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter()

  const form = useForm<z.infer<typeof tenantRegistrationFormSchema>>({
    resolver: zodResolver(tenantRegistrationFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    }
  })
  

  async function createAccountForTenant(value: z.infer<typeof tenantRegistrationFormSchema>) {
    setLoading(true);

    const {success, message} = await registerUserEmail(value.email, value.password, value.name);
    if (success) {
      toast.success(message);
      router.push(MY_ROUTES.verification)
    } else {
      toast.error(message);
    }
    setLoading(false);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={form.handleSubmit(createAccountForTenant)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Fill in the form below to create your account
            </p>
          </div>
          <Field>
            <FieldLabel htmlFor="name">name</FieldLabel>
            <Input id="name" type="text" placeholder="John Doe" {...form.register("name")} />
            <FieldError errors={[{ message: form.formState.errors.name?.message }]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" placeholder="m@example.com" {...form.register("email")} />
            <FieldError errors={[{ message: form.formState.errors.email?.message }]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" type="password" {...form.register("password")} />
            <FieldError errors={[{ message: form.formState.errors.password?.message }]} />
          </Field>
          <Field>
          <FieldLabel htmlFor="confirmPassword">Password</FieldLabel>
            <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
            <FieldError errors={[{ message: form.formState.errors.confirmPassword?.message }]} />
          </Field>
          <Field>

            <Button type="submit" disabled={isLoading}>
              {!isLoading ? "Complete Profile" : "Completing Profile ..."}
            </Button>
            <FieldDescription className="text-center">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login 
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
       
    </div>
  )
}

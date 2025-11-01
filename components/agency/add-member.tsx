'use client';
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { emailValidation } from "@/app/zod_validation/auth_validation";
import { toast } from "sonner";
import {z} from 'zod';
import { sendInvitation } from "@/app/api/agency/member/send-invitation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


export function AddMember() {
    const [isLoading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof emailValidation>>({
        resolver: zodResolver(emailValidation),
        defaultValues: {
          email: "",
        }
      })
     async function onSubmit(values: z.infer<typeof emailValidation>) {
        setLoading(true);

        
        
        const {success, message} = await sendInvitation(values.email);
        if (success) {
            toast.success(message)
        } else {
            toast.error(message)
        }
        setLoading(false);
      }
    return (
        <>
            <div className="m-10">

            <h2 className="mb-5">Add Member</h2>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6")}>

                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" type="email" placeholder="m@example.com" {...form.register('email')}/>
                    <FieldError errors={[{ message: form.formState.errors.email?.message }]} />
                </Field>
                
                <Field>
                   <Button type="submit" disabled={isLoading}> {isLoading ? "Sending Invitation..." : "Send Invitation" }</Button>
                </Field>
            </form>
            </div>
        </>
    )
} 
'use client';
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { emailValidation } from "@/app/zod_validation/auth_validation";
import { toast } from "sonner";
import {z} from 'zod';
import { sendInvitation } from "@/app/api/agency/member/send-invitation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";

interface InviteMemberFormProps {
    onSuccess?: () => void;
}

export function InviteMemberForm({ onSuccess }: InviteMemberFormProps) {
    const form = useForm<z.infer<typeof emailValidation>>({
        resolver: zodResolver(emailValidation),
        defaultValues: {
          email: "",
        }
    });

    async function onSubmit(values: z.infer<typeof emailValidation>) {
        const {success, message} = await sendInvitation(values.email);
        if (success) {
            toast.success(message);
            form.reset();
            onSuccess?.();
        } else {
            toast.error(message);
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-4")}>
            <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="email" 
                        type="email" 
                        placeholder="colleague@example.com" 
                        className="pl-10"
                        {...form.register('email')}
                    />
                </div>
                <FieldError errors={[{ message: form.formState.errors.email?.message }]} />
            </Field>
            
            <div className="flex justify-end gap-2 pt-4">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Sending Invitation..." : "Send Invitation"}
                </Button>
            </div>
        </form>
    );
}



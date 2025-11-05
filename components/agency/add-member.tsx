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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Mail, UserPlus } from "lucide-react";


export function AddMember({ onInvitationSent }: { onInvitationSent?: () => void }) {
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
            toast.success(message);
            form.reset();
            onInvitationSent?.();
        } else {
            toast.error(message);
        }
        setLoading(false);
      }
    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <UserPlus className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle>Invite Team Member</CardTitle>
                        <CardDescription>Send an invitation to join your agency</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
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
                    
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? "Sending Invitation..." : "Send Invitation"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
} 
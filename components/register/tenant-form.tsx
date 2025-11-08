'use client';
import {  FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { RegistrationForm } from "./register-user-form";
import {  RegisterData } from "./data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationFormSchema, tenantRegistrationFormSchema } from "@/app/zod_validation/auth_validation";
import { z } from "zod";
import { registerUserTenant } from "@/app/api/auth/register/register";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import MY_ROUTES from "@/data/routes";

export function TenantForm(allData : RegisterData) {

   const {name, email, password, confirmPassword, setName, setEmail, setPassword, setConfirmPassword} = allData;
    const {next, currentPage, isLoading, setLoading}  = allData;
    const router = useRouter();

    

    const form = useForm<z.infer<typeof registrationFormSchema>>({
        resolver: zodResolver(registrationFormSchema),
        defaultValues: {
            name: name,
            email: email,
            password: password,
            confirmPassword: confirmPassword    
        }
    })

    async function sumbitAgency (value: z.infer<typeof tenantRegistrationFormSchema>) {
        setLoading(true);
        setName(value.name);
        setEmail(value.email);
        setPassword(value.password);
        setConfirmPassword(value.confirmPassword);
        setLoading(false)
        next();
    }
    async function registerTenant(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const {success, message} = await registerUserTenant(name, email, password);
        
        if (success) {
            toast.success(message);
            router.push(MY_ROUTES.verification);
        } else {
            toast.error(message);
        }
        setLoading(false);
    }





    return (
            <>
            {currentPage === 0 ? (
                 <form onSubmit={form.handleSubmit(sumbitAgency)}>
                    <FieldGroup>
                        <RegistrationForm form={form} />
                        <Button type='submit'>Next</Button>
                    </FieldGroup>
                </form>
            ) : (
                <>
                    <form onSubmit={registerTenant}>
                        <FieldGroup>
                            <div className="w-full flex flex-col items-center justify-center text-center py-8">
                                <svg
                                    className="h-14 w-14 text-green-600"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M9 12l2 2 4-4" />
                                </svg>
                                <p className="mt-4 text-base font-medium">All required fields have been filled.</p>
                                <p className="text-sm text-muted-foreground">Press Register to complete your registration.</p>
                            </div>
                            <Button type="submit" disabled={isLoading}>{isLoading ? "Registering..." : "Register"}</Button>
                        </FieldGroup>

                    </form>
                    <Button className="mt-5 w-full" type="button" disabled={isLoading} onClick={next}>Go Back</Button>
                </>
                
            )}
            
            </>
        
      
    );
}
import React from "react";
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RegistrationForm } from "./register-user-form";
import {  RegisterData } from "./data";
import { agencyRegistrationFormSchema, registrationFormSchema, tenantRegistrationFormSchema } from "@/app/zod_validation/auth_validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerUserAgency } from "@/app/api/auth/register/register";
import routes from "@/data/routes";



export function AgentForm(allData : RegisterData) {
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
    const agencyForm = useForm<z.infer<typeof agencyRegistrationFormSchema>>({
        resolver: zodResolver(agencyRegistrationFormSchema),
        defaultValues: {
            agencyName: "",
            agencyEmail: "",
            agencyAddress: "",
            sirenNumber: ""
        }
      })

      async function submitAgency (value: z.infer<typeof tenantRegistrationFormSchema>) {
        setLoading(true);
        setName(value.name);
        setEmail(value.email);
        setPassword(value.password);
        setConfirmPassword(value.confirmPassword);
        setLoading(false)
        next()
      }

      async function registerAgency(value: z.infer<typeof agencyRegistrationFormSchema>) {
        setLoading(true);

        const {success, message} = await registerUserAgency(
            name,
            email,
            password,
            value.agencyName,
            value.agencyEmail,
            value.agencyAddress,
            value.sirenNumber
        );

        if (success) {
            toast.success(message);
            router.push(routes.verification);
        } else {
            toast.error(message);
        }

        setLoading(false);
      }


    return (
        <>
        {currentPage === 0 ? (
            <form onSubmit={form.handleSubmit(submitAgency)}>
                <FieldGroup>
                    <RegistrationForm form={form} />
                    <Button type={"submit"}>Next</Button>
                </FieldGroup>
            </form>
    ) : (
            <>
            <form onSubmit={agencyForm.handleSubmit(registerAgency)}> 
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="agencyName">Agency Name</FieldLabel>
                        <Input id="agencyName" type="text" placeholder="John Doe"  {...agencyForm.register("agencyName")} />
                        <FieldError>{agencyForm.formState.errors.agencyName?.message}</FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="agencyEmail">Agency Email</FieldLabel>
                        <Input id="agencyEmail" type="email" placeholder="john@example.com" {...agencyForm.register("agencyEmail")} />
                        <FieldError>{agencyForm.formState.errors.agencyEmail?.message}</FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="agencyAddress">Agency Address</FieldLabel>
                        <Input id="agencyAddress" type="text" placeholder="123 Main St" {...agencyForm.register("agencyAddress")} />
                        <FieldError>{agencyForm.formState.errors.agencyAddress?.message}</FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="sirenNumber">SIREN Number</FieldLabel>
                        <Input id="sirenNumber" type="text" placeholder="123456789" {...agencyForm.register("sirenNumber")} />
                        <FieldError>{agencyForm.formState.errors.sirenNumber?.message}</FieldError>
                    </Field>
                    <Button type="submit" disabled={isLoading}>{isLoading ? "Registering..." : "Register"}</Button>
                </FieldGroup>

            </form>
            <Button className="mt-5 w-full" type="button" disabled={isLoading} onClick={next}>Go Back</Button>
        </>
        )}
        </>
  );
}
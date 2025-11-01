import { UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";


interface RegistrationFormProps {
    form: UseFormReturn<
        {
            name: string;
            email: string;
            password: string;
            confirmPassword: string;
        },
        any
    >;
}



export function RegistrationForm({form} : RegistrationFormProps  ) {

    return (
        <>
            <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
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
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
            <FieldError errors={[{ message: form.formState.errors.confirmPassword?.message }]} />
            </Field>
        </>
    )
}
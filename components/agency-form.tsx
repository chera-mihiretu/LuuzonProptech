"use client";
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { saveUserAsAgency, saveUserAsTenant } from "@/app/api/auth/complete-profile/complete-profile";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SetLoading {
    isLoading : boolean
    setLoading:  (isLoading: boolean) => void
}
const agencySchema = z.object({
  agencyName: z.string().trim().min(2, { message: "Agency name is required." }),
  managerName: z.string().trim().min(2, { message : "Manager Name is required."}),
  agencyEmail: z.string().trim().toLowerCase().email({ message: "Invalid email address format." }),
  address: z.string().trim().min(1, { message: "Address is required." }),
  sirenSiret: z.string().trim().min(9, { message: "SIREN/SIRET must be at least 9 digits." }),
})

type AgencyFormValues = z.infer<typeof agencySchema>

export function AgencyForm(loading : SetLoading) {
    const router = useRouter();

  const form = useForm<AgencyFormValues>({
    resolver: zodResolver(agencySchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      agencyName: "",
      agencyEmail: "",
      address: "France",
      sirenSiret: "",
    },
  })



  async function onSubmit(values: AgencyFormValues) {
    
    loading.setLoading(true);
    // TODO: wire to backend when ready
    const {success, message} = await saveUserAsAgency(
        values.agencyName, values.address, values.agencyEmail, values.sirenSiret, values.managerName
    );
    console.log(success, message)
    if (success) {
        console.log('Why is router not working ')
        toast.success(message)
        router.push('/redirecting')
    } else {    
        toast.error(message);
    }
    loading.setLoading(false);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
      <Field>
          <FieldLabel htmlFor="agencyName">Agency Name</FieldLabel>
          <Input id="agencyName" type="text" placeholder="Acme Realty" {...form.register("agencyName")} />
          <FieldError errors={[{ message: form.formState.errors.agencyName?.message }]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="managerName">Manager Name</FieldLabel>
          <Input id="managerName" type="text" placeholder="John Doe" {...form.register("managerName")} />
          <FieldError errors={[{ message: form.formState.errors.managerName?.message }]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="agencyEmail">Agency Email</FieldLabel>
          <Input id="agencyEmail" type="email" placeholder="agency@example.com" {...form.register("agencyEmail")} />
          <FieldError errors={[{ message: form.formState.errors.agencyEmail?.message }]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="address">Address</FieldLabel>
          <Input id="address" type="text" placeholder="France" {...form.register("address")} />
          <FieldDescription>Default is France</FieldDescription>
          <FieldError errors={[{ message: form.formState.errors.address?.message }]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="sirenSiret">SIREN / SIRET</FieldLabel>
          <Input id="sirenSiret" type="text" placeholder="e.g. 123 456 789" {...form.register("sirenSiret")} />
          <FieldError errors={[{ message: form.formState.errors.sirenSiret?.message }]} />
        </Field>
        <Field>
          <Button type="submit" disabled={loading.isLoading}> { loading.isLoading ? "Loading..." : "Save Agency"}</Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default AgencyForm



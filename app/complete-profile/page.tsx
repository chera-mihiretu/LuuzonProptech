"use client"
import { useState } from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { Button } from "@/components/ui/button"
import AgencyForm from "@/components/agency-form"
import { saveUserAsTenant } from "../api/auth/complete-profile/complete-profile"
import { toast } from "sonner"
import {useRouter} from "next/navigation";
import MY_ROUTES from "@/data/routes"
export default function CompleteProfile() {
  const [role, setRole] = useState<"tenant" | "agency" | null>(null)
  const [isLoading, setLoading] = useState(false);
  const router = useRouter()
  async function continueAsTenant () { 
    setLoading(true);
    setRole('tenant');

    const {success, message} = await saveUserAsTenant();
    
    if (success) {
      toast.success(message)
      router.push(MY_ROUTES.redirect)
    }else {
      toast.error(message)
    }
    setLoading(false)
   
  }
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-full max-w-md flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">Register as Tenant or Agency!</h1>
            <div className="flex gap-3">
              <Button variant={role === "tenant" ? "default" : "outline"} disabled={isLoading} onClick={continueAsTenant}>
                Continue as Tenant
              </Button>
              <Button variant={role === "agency" ? "default" : "outline"} disabled={isLoading} onClick={() => setRole("agency")} >
                Continue as Agency
              </Button>
            </div>
            {role === "agency" && (
              <div className="w-full">
                <AgencyForm isLoading={isLoading} setLoading={setLoading}  />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolu te inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}

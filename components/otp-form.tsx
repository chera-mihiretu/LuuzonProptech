import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function VerificationForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Verify Your email!</h1>
            <p className="text-muted-foreground text-sm text-balance">
              We sent a verification to your email.
            </p>
          </div>

          <FieldDescription className="text-center">
            Didn&apos;t receive the code? <a href="#">Resend</a>
            {
              // TODO : Implement the resend email 
            }
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  )
}

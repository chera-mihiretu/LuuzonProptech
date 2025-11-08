"use client";

import { useState, useEffect, FormEvent } from "react";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { saveAgencyStaff, getInvitationEmail } from "@/app/api/auth/register/accept-invitation";
import MY_ROUTES from "@/data/routes";

interface InvitationFormProps {
  token: string;
}

export default function InvitationForm({ token }: InvitationFormProps) {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [tokenValid, setTokenValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const result = await getInvitationEmail(token);
        if (result.success && result.email) {
          setEmail(result.email);
          setTokenValid(true);
        } else {
          toast.error(result.message || "Invalid invitation token");
          router.push(MY_ROUTES.login);
        }
      } catch (error) {
        toast.error("Invalid or expired invitation token");
        router.push(MY_ROUTES.login);
      }
    };
    
    if (token) {
      validateToken();
    }
  }, [token, router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (!tokenValid || !email) {
      toast.error("Invalid invitation token");
      return;
    }

    setIsLoading(true);
    try {
      const result = await saveAgencyStaff(
        token,
        name,
        email,
        password
      );

      if (result.success) {
        toast.success(result.message);
        router.push(MY_ROUTES.verification);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  }

  if (!tokenValid) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">Validating invitation...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Accept Invitation</h1>
        <p className="text-sm text-muted-foreground mt-2">
          You've been invited to join an agency. Please complete your registration.
        </p>
      </div>

      {/* Display Email */}
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground mb-1">Invited Email:</p>
        <p className="text-base font-medium">{email}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}

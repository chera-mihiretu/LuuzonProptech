"use client";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import {  useForm } from "react-hook-form"
import {  z } from "zod";
import {  tenantRegistrationFormSchema } from "@/app/zod_validation/auth_validation"; 
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerUserEmail } from "@/app/api/auth/register/register";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import GoogleIcon from "@/data/icons";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AgentForm } from "@/components/register/agent-form";
import { TenantForm } from "@/components/register/tenant-form";
import MY_ROUTES from "@/data/routes";



export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [currentTab, setCurrentTab] = useState("tenant");
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  


  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % 2);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Tabs
        defaultValue="tenant"
        value={currentTab}
        onValueChange={(value) => {
          setCurrentTab(value);
        }}
        className="w-full"
      >
        <TabsList className="flex justify-center w-full">
          <TabsTrigger value="tenant" className="flex-1 text-center">Tenant</TabsTrigger>
          <TabsTrigger value="agency" className="flex-1 text-center">Agency</TabsTrigger>
        </TabsList>
        <TabsContent value="tenant">
          <TenantForm 
          next={handleNext}  
          currentPage={currentPage} 
          isLoading={isLoading} 
          setLoading={setLoading} 
          
          name={name}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          setName={setName}
          setEmail={setEmail}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          />
        </TabsContent>
        <TabsContent value="agency">
          <AgentForm 
          next={handleNext}  
          currentPage={currentPage} 
          isLoading={isLoading} 
          setLoading={setLoading} 

          name={name}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          setName={setName}
          setEmail={setEmail}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword} />
        </TabsContent>
        <FieldDescription className="text-center">
            Go back to?{" "}
            <a href={MY_ROUTES.login} className="underline underline-offset-4">
              log in
            </a>
          </FieldDescription>
      </Tabs>
    </div>
  );
}

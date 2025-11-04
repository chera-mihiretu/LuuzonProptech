'use client';
import { useEffect } from 'react';
import { TenantSidebar } from "@/components/app-sidebar"

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Checkbox } from "@radix-ui/react-checkbox";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Check } from "lucide-react";
import { updateLastSignIn } from "@/app/api/auth/update-last-signin";

export default function TenantDashboard() {
  useEffect(() => {
    // Update last_sign_in when dashboard loads
    updateLastSignIn().catch((error) => {
      console.error("Failed to update last_sign_in:", error);
    });
  }, []);

  return (
    <SidebarProvider>
      <TenantSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" >
            <Card>
              <CardHeader>
                <CardTitle>User Settings</CardTitle>
                <CardDescription>Edit your profile and preference</CardDescription>
              </CardHeader>
              
              

            </Card>
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

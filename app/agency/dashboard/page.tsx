'use client';
import { useEffect } from 'react';
import AgenciesSidebar from "@/components/agency/agency-side-bar";
import { AgentSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { updateLastSignIn } from "@/app/api/auth/update-last-signin";

export default function AgencyDashboardPage() {
  useEffect(() => {
    // Update last_sign_in when dashboard loads
    updateLastSignIn().catch((error) => {
      console.error("Failed to update last_sign_in:", error);
    });
  }, []);

  return (
   <AgenciesSidebar>
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl"> 
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
   </AgenciesSidebar>
  )
}

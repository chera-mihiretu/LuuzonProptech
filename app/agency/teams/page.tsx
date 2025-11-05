"use client";

import { useState, useRef } from "react";
import AgenciesSidebar from "@/components/agency/agency-side-bar";
import { AgencyTeamTable, AgencyTeamTableRef } from "@/components/agency/custom-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { InviteMemberForm } from "@/components/agency/invite-member-form";

export default function AgenciesTeams() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const tableRef = useRef<AgencyTeamTableRef>(null);

  const handleInvitationSent = () => {
    // Close the dialog
    setIsDialogOpen(false);
    // Trigger a refresh of the table data after a short delay
    setTimeout(() => {
      tableRef.current?.refresh();
    }, 500);
  };

  return (
    <AgenciesSidebar>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
            <p className="text-muted-foreground">
              Manage your agency employees and invitations
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="size-4" />
            Invite Member
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setIsDialogOpen(false);
          }
        }}>
          <DialogContent 
            className="max-w-md"
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your agency
              </DialogDescription>
            </DialogHeader>
            <InviteMemberForm
              onSuccess={handleInvitationSent}
            />
          </DialogContent>
        </Dialog>

        {/* Employees and Invitations Tables Section */}
        <div className="flex-1">
          <AgencyTeamTable ref={tableRef} />
        </div>
      </div>
    </AgenciesSidebar>
  );
}

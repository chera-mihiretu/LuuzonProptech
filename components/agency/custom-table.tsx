"use client"

import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { getAgencyEmployees, getAgencyInvitations } from "@/app/api/agency/member/send-invitation";
import { UserModel } from "@/data/models/user.model";
import { InvitationModel } from "@/data/models/invitation.model";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Users, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { updateUserPermissions, getUserPermissions } from "@/app/api/agency/member/send-invitation";

type InvitationStatus = "pending" | "accepted" | "rejected" | "canceled";

function StatusBadge({ status }: { status?: InvitationStatus }) {
  const statusConfig = {
    pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20" },
    accepted: { label: "Accepted", className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" },
    rejected: { label: "Rejected", className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20" },
    canceled: { label: "Canceled", className: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20" },
  };

  const config = statusConfig[status || "pending"] || statusConfig.pending;

  return (
    <Badge variant="outline" className={cn("border", config.className)}>
      {config.label}
    </Badge>
  );
}

function formatDate(date?: Date | string) {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

function formatDateTime(date?: Date | string) {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export interface AgencyTeamTableRef {
  refresh: () => void;
}

export const AgencyTeamTable = forwardRef<AgencyTeamTableRef>((props, ref) => {
  const [employees, setEmployees] = useState<UserModel[]>([]);
  const [invitations, setInvitations] = useState<InvitationModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPermDialogOpen, setIsPermDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>("");
  const [savingPerms, setSavingPerms] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

  const ALL_PERMISSIONS: { key: string; label: string }[] = [
    { key: "DELETE_PROPERT", label: "Delete Property" },
    { key: "EDIT_PROPERTY", label: "Edit Property" },
    { key: "ACCEPT_APPICATION", label: "Accept Application" },
    { key: "REJECT_APPLICATION", label: "Reject Application" },
    { key: "PERMISSION_EDIT", label: "Edit Permissions" },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [employeesResult, invitationsResult] = await Promise.all([
        getAgencyEmployees(),
        getAgencyInvitations(),
      ]);

      if (employeesResult.success) {
        setEmployees(employeesResult.employees);
      }
      if (invitationsResult.success) {
        setInvitations(invitationsResult.invitations);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchData,
  }));

  useEffect(() => {
    fetchData();
  }, []);

  const openPermissionsDialog = async (user: UserModel) => {
    setSelectedUserId(user.user_id);
    setSelectedUserName(user.name);
    setIsPermDialogOpen(true);
    try {
      const res = await getUserPermissions(user.user_id);
      if (res.success) {
        const perms = Array.isArray(res.permissions) ? res.permissions : [];
        // Normalize to enum KEYS if values were stored differently
        const normalized = new Set<string>(
          perms.map((p: any) => (typeof p === "string" ? p.toUpperCase() : String(p)))
        );
        setSelectedPermissions(normalized);
      } else {
        toast.error(res.message || "Failed to load permissions");
        setSelectedPermissions(new Set());
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to load permissions");
      setSelectedPermissions(new Set());
    }
  };

  const togglePermission = (key: string, checked: boolean | string) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (checked) next.add(key);
      else next.delete(key);
      return next;
    });
  };

  const savePermissions = async () => {
    if (!selectedUserId) return;
    setSavingPerms(true);
    try {
      const res = await updateUserPermissions(selectedUserId, Array.from(selectedPermissions));
      if (res.success) {
        toast.success("Permissions updated");
        setIsPermDialogOpen(false);
        setSelectedUserId(null);
        setSelectedUserName("");
        await fetchData();
      } else {
        toast.error(res.message || "You have no privilege to edit permissions");
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to update permissions");
    } finally {
      setSavingPerms(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Agency Employees Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Agency Employees</CardTitle>
              <CardDescription>Active team members in your agency</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No employees found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead className="text-right">Edit Permission</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee._id?.toString() || employee.user_id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{employee.role}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(employee.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => openPermissionsDialog(employee)}>
                          Edit Permission
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isPermDialogOpen} onOpenChange={(open) => setIsPermDialogOpen(open)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Permissions</DialogTitle>
            <DialogDescription>
              Set permissions for {selectedUserName || "user"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {ALL_PERMISSIONS.map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox id={key} checked={selectedPermissions.has(key)} onCheckedChange={(c) => togglePermission(key, c)} />
                <Label htmlFor={key}>{label}</Label>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsPermDialogOpen(false)} disabled={savingPerms}>Cancel</Button>
            <Button onClick={savePermissions} disabled={savingPerms}>{savingPerms ? "Saving..." : "Save"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invitations Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Invitations</CardTitle>
              <CardDescription>Invitations sent to potential team members</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {invitations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No invitations sent yet</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent Date</TableHead>
                    <TableHead>Expires Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invitation) => (
                    <TableRow key={invitation._id?.toString()}>
                      <TableCell className="font-medium">{invitation.invited_person_email}</TableCell>
                      <TableCell>
                        <StatusBadge status={invitation.status} />
                      </TableCell>
                      <TableCell>{formatDate(invitation.created_at)}</TableCell>
                      <TableCell>{formatDateTime(invitation.expires_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

AgencyTeamTable.displayName = "AgencyTeamTable";

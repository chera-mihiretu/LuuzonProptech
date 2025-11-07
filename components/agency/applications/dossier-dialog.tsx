'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TenantDossier } from "@/data/models/user.model";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DossierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dossier: TenantDossier | null;
  tenantName?: string;
}

export function DossierDialog({ open, onOpenChange, dossier, tenantName }: DossierDialogProps) {
  if (!dossier) {
    return null;
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0).toUpperCase() || '';
    const last = lastName?.charAt(0).toUpperCase() || '';
    return first + last || 'U';
  };

  const initials = getInitials(
    dossier.profileInfo?.first_name,
    dossier.profileInfo?.last_name
  );

  const fullName = dossier.profileInfo?.first_name && dossier.profileInfo?.last_name
    ? `${dossier.profileInfo.first_name} ${dossier.profileInfo.last_name}`
    : tenantName || 'Unknown';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tenant Dossier</DialogTitle>
          <DialogDescription>
            Complete profile information for {fullName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar Section */}
          {dossier.avatar_url && (
            <div className="flex justify-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={dossier.avatar_url} alt={fullName} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
            </div>
          )}

          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">First Name</p>
                  <p className="text-base">{dossier.profileInfo?.first_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                  <p className="text-base">{dossier.profileInfo?.last_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base">{dossier.profileInfo?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-base">{dossier.profileInfo?.phone || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p className="text-base">{dossier.profileInfo?.address || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Job Title</p>
                  <p className="text-base">{dossier.employmentDetails?.job_title || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Employer</p>
                  <p className="text-base">{dossier.employmentDetails?.employer || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Salary</p>
                  <p className="text-base">
                    {dossier.employmentDetails?.salary !== undefined
                      ? `${dossier.employmentDetails.salary.toLocaleString()} €`
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Employment Status</p>
                  <p className="text-base">{dossier.employmentDetails?.employment_status || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Information */}
          <Card>
            <CardHeader>
              <CardTitle>Application Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Application Type</p>
                  <Badge variant="outline">
                    {dossier.application_type || 'N/A'}
                  </Badge>
                </div>
                {dossier.ai_credit_score !== null && dossier.ai_credit_score !== undefined && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">AI Credit Score</p>
                    <Badge variant="secondary">
                      {dossier.ai_credit_score}
                    </Badge>
                  </div>
                )}
              </div>
              {dossier.gdpr_summary && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">GDPR Summary</p>
                  <p className="text-sm text-muted-foreground">{dossier.gdpr_summary}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          {dossier.uploaded_docs && dossier.uploaded_docs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dossier.uploaded_docs.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {doc.name || `Document ${index + 1}`}
                          </p>
                          {doc.type && (
                            <p className="text-xs text-muted-foreground">{doc.type}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(doc.url, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Shareable Link */}
          {dossier.shareable_link && (
            <Card>
              <CardHeader>
                <CardTitle>Shareable Link</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={dossier.shareable_link}
                    className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(dossier.shareable_link!);
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


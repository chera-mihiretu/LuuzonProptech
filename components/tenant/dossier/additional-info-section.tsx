'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TenantDossier } from "@/data/models/user.model";

interface AdditionalInfoSectionProps {
  dossier: TenantDossier;
}

export function AdditionalInfoSection({ dossier }: AdditionalInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
        <CardDescription>Other dossier details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {dossier.shareable_link && (
          <div className="space-y-2">
            <Label>Shareable Link</Label>
            <div className="min-h-[36px] px-3 py-2 text-sm border border-transparent rounded-md bg-muted/50 flex items-center break-all">
              {dossier.shareable_link}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


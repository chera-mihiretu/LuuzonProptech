'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { EditableField } from "./editable-field";
import { TenantDossier, ApplicationType } from "@/data/models/user.model";

interface ApplicationInfoSectionProps {
  dossier: TenantDossier;
  originalDossier: TenantDossier;
  fieldChanges: Record<string, any>;
  dossierVersion: number;
  isSaving: boolean;
  onFieldChange: (fieldPath: string, value: any) => void;
  getFieldValue: (fieldPath: string) => any;
  getOriginalValue: (fieldPath: string) => any;
}

export function ApplicationInfoSection({
  dossier,
  originalDossier,
  fieldChanges,
  dossierVersion,
  isSaving,
  onFieldChange,
  getFieldValue,
  getOriginalValue
}: ApplicationInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Information</CardTitle>
        <CardDescription>Your application details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <EditableField
          label="Application Type"
          fieldPath="application_type"
          type="select"
          options={[
            { value: ApplicationType.Single, label: 'Single' },
            { value: ApplicationType.Couple, label: 'Couple' },
            { value: ApplicationType.Family, label: 'Family' }
          ]}
          dossier={dossier}
          originalDossier={originalDossier}
          fieldChanges={fieldChanges}
          dossierVersion={dossierVersion}
          isSaving={isSaving}
          onFieldChange={onFieldChange}
          getFieldValue={getFieldValue}
          getOriginalValue={getOriginalValue}
        />
        <EditableField
          label="GDPR Summary"
          fieldPath="gdpr_summary"
          multiline
          dossier={dossier}
          originalDossier={originalDossier}
          fieldChanges={fieldChanges}
          dossierVersion={dossierVersion}
          isSaving={isSaving}
          onFieldChange={onFieldChange}
          getFieldValue={getFieldValue}
          getOriginalValue={getOriginalValue}
        />
        {dossier.ai_credit_score !== null && (
          <div className="space-y-2">
            <Label>AI Credit Score</Label>
            <div className="min-h-[36px] px-3 py-2 text-sm border border-transparent rounded-md bg-muted/50 flex items-center">
              {dossier.ai_credit_score}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


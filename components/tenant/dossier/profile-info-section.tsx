'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EditableField } from "./editable-field";
import { TenantDossier } from "@/data/models/user.model";

interface ProfileInfoSectionProps {
  dossier: TenantDossier;
  originalDossier: TenantDossier;
  fieldChanges: Record<string, any>;
  dossierVersion: number;
  isSaving: boolean;
  onFieldChange: (fieldPath: string, value: any) => void;
  getFieldValue: (fieldPath: string) => any;
  getOriginalValue: (fieldPath: string) => any;
}

export function ProfileInfoSection({
  dossier,
  originalDossier,
  fieldChanges,
  dossierVersion,
  isSaving,
  onFieldChange,
  getFieldValue,
  getOriginalValue
}: ProfileInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Your personal details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <EditableField
          label="First Name"
          fieldPath="profileInfo.first_name"
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
          label="Last Name"
          fieldPath="profileInfo.last_name"
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
          label="Email"
          fieldPath="profileInfo.email"
          type="email"
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
          label="Phone"
          fieldPath="profileInfo.phone"
          type="tel"
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
          label="Address"
          fieldPath="profileInfo.address"
          dossier={dossier}
          originalDossier={originalDossier}
          fieldChanges={fieldChanges}
          dossierVersion={dossierVersion}
          isSaving={isSaving}
          onFieldChange={onFieldChange}
          getFieldValue={getFieldValue}
          getOriginalValue={getOriginalValue}
        />
      </CardContent>
    </Card>
  );
}


'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EditableField } from "./editable-field";
import { TenantDossier, EmploymentStatus } from "@/data/models/user.model";

interface EmploymentDetailsSectionProps {
  dossier: TenantDossier;
  originalDossier: TenantDossier;
  fieldChanges: Record<string, any>;
  dossierVersion: number;
  isSaving: boolean;
  onFieldChange: (fieldPath: string, value: any) => void;
  getFieldValue: (fieldPath: string) => any;
  getOriginalValue: (fieldPath: string) => any;
}

export function EmploymentDetailsSection({
  dossier,
  originalDossier,
  fieldChanges,
  dossierVersion,
  isSaving,
  onFieldChange,
  getFieldValue,
  getOriginalValue
}: EmploymentDetailsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employment Details</CardTitle>
        <CardDescription>Your employment information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <EditableField
          label="Job Title"
          fieldPath="employmentDetails.job_title"
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
          label="Employer"
          fieldPath="employmentDetails.employer"
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
          label="Salary"
          fieldPath="employmentDetails.salary"
          type="number"
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
          label="Employment Status"
          fieldPath="employmentDetails.employment_status"
          type="select"
          options={[
            { value: EmploymentStatus.FullTime, label: 'Full Time' },
            { value: EmploymentStatus.PartTime, label: 'Part Time' },
            { value: EmploymentStatus.Contract, label: 'Contract' },
            { value: EmploymentStatus.Unemployed, label: 'Unemployed' }
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
      </CardContent>
    </Card>
  );
}


'use client';
import { useEffect, useState } from 'react';
import { TenantSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { getTenantDossier } from "@/app/api/tenant/dossier/get-dossier";
import { updateTenantDossier } from "@/app/api/tenant/dossier/update-dossier";
import { TenantDossier, ApplicationType, EmploymentStatus, DossierDocument } from "@/data/models/user.model";
import { uploadAvatar, uploadMultipleDocuments, clientDeleteFromSupabase } from "@/lib/supabase-client";
import { toast } from "sonner";
import { AvatarUpload } from "@/components/tenant/dossier/avatar-upload";
import { DocumentList } from "@/components/tenant/dossier/document-list";
import { ProfileInfoSection } from "@/components/tenant/dossier/profile-info-section";
import { EmploymentDetailsSection } from "@/components/tenant/dossier/employment-details-section";
import { ApplicationInfoSection } from "@/components/tenant/dossier/application-info-section";
import { AdditionalInfoSection } from "@/components/tenant/dossier/additional-info-section";

export default function TenantDossierPage() {
  const [dossier, setDossier] = useState<TenantDossier | null>(null);
  const [originalDossier, setOriginalDossier] = useState<TenantDossier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Pending file changes - only applied when Apply is clicked
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [pendingAvatarPreview, setPendingAvatarPreview] = useState<string | null>(null);
  const [pendingDocuments, setPendingDocuments] = useState<File[]>([]);
  const [pendingDocumentDeletions, setPendingDocumentDeletions] = useState<string[]>([]);

  // Fetch dossier data on mount
  useEffect(() => {
    fetchDossier();
  }, []);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (pendingAvatarPreview) {
        URL.revokeObjectURL(pendingAvatarPreview);
      }
      if (dossier?.uploaded_docs) {
        dossier.uploaded_docs.forEach((doc) => {
          if (doc.url.startsWith('blob:')) {
            URL.revokeObjectURL(doc.url);
          }
        });
      }
    };
  }, [pendingAvatarPreview, dossier]);

  const fetchDossier = async () => {
    try {
      setIsLoading(true);
      const result = await getTenantDossier();
      if (result.success && result.data) {
        const fetchedDossier = result.data;
        setDossier(JSON.parse(JSON.stringify(fetchedDossier)));
        setOriginalDossier(JSON.parse(JSON.stringify(fetchedDossier)));
        setDossierVersion(prev => prev + 1); // Increment version to trigger sync
      } else if (result.success && !result.data) {
        // No dossier exists, create default
        const defaultDossier: TenantDossier = {
          tenant_id: result.userId || '',
          avatar_url: undefined,
          profileInfo: {
            first_name: '',
            last_name: '',
            email: result.userEmail || '',
            phone: '',
            address: ''
          },
          employmentDetails: {
            job_title: '',
            employer: '',
            salary: 0,
            employment_status: EmploymentStatus.FullTime
          },
          uploaded_docs: [],
          shareable_link: '',
          ai_credit_score: null,
          application_type: ApplicationType.Single,
          gdpr_summary: ''
        };
        setDossier(defaultDossier);
        setOriginalDossier(JSON.parse(JSON.stringify(defaultDossier)));
        setDossierVersion(prev => prev + 1); // Increment version to trigger sync
      }
    } catch (error) {
      console.error("Error fetching dossier:", error);
      toast.error("Failed to load dossier");
    } finally {
      setIsLoading(false);
    }
  };

  // Simple field changes tracker - stores only changed values
  const [fieldChanges, setFieldChanges] = useState<Record<string, any>>({});
  const [dossierVersion, setDossierVersion] = useState(0);

  // Helper to get current value (from changes or dossier)
  const getFieldValue = (fieldPath: string): any => {
    if (fieldChanges[fieldPath] !== undefined) {
      return fieldChanges[fieldPath];
    }
    if (!dossier) return '';
    const parts = fieldPath.split('.');
    let current: any = dossier;
    for (const part of parts) {
      if (current === null || current === undefined) return '';
      current = current[part];
    }
    return current ?? '';
  };

  // Helper to get original value
  const getOriginalValue = (fieldPath: string): any => {
    if (!originalDossier) return '';
    const parts = fieldPath.split('.');
    let current: any = originalDossier;
    for (const part of parts) {
      if (current === null || current === undefined) return '';
      current = current[part];
    }
    return current ?? '';
  };

  // Check if there are any changes
  const hasChanges = (): boolean => {
    if (!dossier || !originalDossier) return false;

    // Check field changes
    if (Object.keys(fieldChanges).length > 0) {
      return true;
    }

    // Check for pending file changes
    if (pendingAvatarFile || pendingDocuments.length > 0 || pendingDocumentDeletions.length > 0) {
      return true;
    }

    // Check for document count changes
    const originalDocCount = originalDossier.uploaded_docs?.length || 0;
    const currentDocCount = dossier.uploaded_docs?.filter(doc => !(doc as any)._isPending).length || 0;
    if (originalDocCount !== currentDocCount) {
      return true;
    }

    return false;
  };

  // Handle field change - only update local changes tracker
  const handleFieldChange = (fieldPath: string, value: any) => {
    setFieldChanges(prev => ({
      ...prev,
      [fieldPath]: value
    }));
  };

  // Handle avatar upload
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !dossier) return;

    // Validate file type
    if (!file.type.startsWith('image/') || !['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      toast.error("Please upload a JPEG or PNG image");
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    // Revoke previous preview if exists
    if (pendingAvatarPreview) {
      URL.revokeObjectURL(pendingAvatarPreview);
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setPendingAvatarFile(file);
    setPendingAvatarPreview(previewUrl);

    // Update dossier with preview (temporary)
    setDossier({
      ...dossier,
      avatar_url: previewUrl
    });
  };

  // Handle document upload
  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0 || !dossier) return;

    // Validate files
    const validFiles: File[] = [];
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxDocuments = 10;

    const currentDocCount = dossier.uploaded_docs?.filter(doc => !(doc as any)._isPending).length || 0;

    for (const file of files) {
      if (currentDocCount + validFiles.length >= maxDocuments) {
        toast.error(`Maximum ${maxDocuments} documents allowed`);
        break;
      }

      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name}: Only PDF, JPEG, and PNG files are allowed`);
        continue;
      }

      if (file.size > maxSize) {
        toast.error(`${file.name}: File size must be less than 2MB`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Add to pending documents
    setPendingDocuments(prev => [...prev, ...validFiles]);

    // Create preview documents
    const newDocuments: DossierDocument[] = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      _isPending: true
    }));

    const existingDocs = dossier.uploaded_docs || [];
    setDossier({
      ...dossier,
      uploaded_docs: [...existingDocs, ...newDocuments]
    });
  };

  // Handle document deletion
  const handleDeleteDocument = (index: number) => {
    if (!dossier || !dossier.uploaded_docs) return;

    const documents = dossier.uploaded_docs;
    const documentToDelete = documents[index];

    if (!documentToDelete || !documentToDelete.url) return;

    // If pending document, remove from pending files
    if ((documentToDelete as any)._isPending) {
      setPendingDocuments(prev => {
        const fileIndex = prev.findIndex(f => f.name === documentToDelete.name);
        if (fileIndex !== -1) {
          const newPending = [...prev];
          newPending.splice(fileIndex, 1);
          // Revoke blob URL
          URL.revokeObjectURL(documentToDelete.url);
          return newPending;
        }
        return prev;
      });
    } else {
      // Mark for deletion (will be deleted from storage on Apply)
      setPendingDocumentDeletions(prev => [...prev, documentToDelete.url]);
    }

    // Remove from dossier immediately (UI update)
    const updatedDocs = documents.filter((_, i) => i !== index);
    setDossier({
      ...dossier,
      uploaded_docs: updatedDocs
    });
  };

  // Helper to apply field changes to dossier
  const applyFieldChangesToDossier = (dossier: TenantDossier): TenantDossier => {
    const updated = JSON.parse(JSON.stringify(dossier));
    Object.entries(fieldChanges).forEach(([fieldPath, value]) => {
      const parts = fieldPath.split('.');
      let current: any = updated;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
    });
    return updated;
  };

  // Handle Apply button
  const handleApply = async () => {
    if (!dossier || !originalDossier || !hasChanges()) {
      toast.info("No changes to apply");
      return;
    }

    try {
      setIsSaving(true);
      // Start with current dossier and apply field changes
      let updatedDossier = applyFieldChangesToDossier(dossier);

      // 1. Upload new avatar if pending
      if (pendingAvatarFile) {
        toast.loading("Uploading avatar...", { id: "apply-avatar" });
        try {
          const avatarUrl = await uploadAvatar(pendingAvatarFile);

          // Delete old avatar from storage if it exists and is not a blob URL
          if (originalDossier.avatar_url && !originalDossier.avatar_url.startsWith('blob:')) {
            await clientDeleteFromSupabase(originalDossier.avatar_url, 'avatars');
          }

          // Revoke preview URL
          if (pendingAvatarPreview) {
            URL.revokeObjectURL(pendingAvatarPreview);
          }

          updatedDossier.avatar_url = avatarUrl;
          setPendingAvatarFile(null);
          setPendingAvatarPreview(null);
          toast.success("Avatar uploaded!", { id: "apply-avatar" });
        } catch (error) {
          console.error("Error uploading avatar:", error);
          toast.error("Failed to upload avatar", { id: "apply-avatar" });
          setIsSaving(false);
          return;
        }
      }

      // 2. Upload pending documents
      if (pendingDocuments.length > 0) {
        toast.loading(`Uploading ${pendingDocuments.length} document(s)...`, { id: "apply-documents" });
        try {
          const documentUrls = await uploadMultipleDocuments(pendingDocuments);

          // Replace pending documents with actual URLs
          const existingDocs = updatedDossier.uploaded_docs?.filter(doc => !(doc as any)._isPending) || [];
          const newDocuments: DossierDocument[] = documentUrls.map((url, index) => {
            const file = pendingDocuments[index];
            // Revoke blob URL
            const pendingDoc = updatedDossier.uploaded_docs?.find(doc => (doc as any)._isPending && doc.name === file.name);
            if (pendingDoc) {
              URL.revokeObjectURL(pendingDoc.url);
            }
            return {
              url,
              name: file.name,
              type: file.type
            };
          });

          updatedDossier.uploaded_docs = [...existingDocs, ...newDocuments];
          setPendingDocuments([]);
          toast.success("Documents uploaded!", { id: "apply-documents" });
        } catch (error) {
          console.error("Error uploading documents:", error);
          toast.error("Failed to upload documents", { id: "apply-documents" });
          setIsSaving(false);
          return;
        }
      }

      // 3. Delete marked documents from storage
      if (pendingDocumentDeletions.length > 0) {
        toast.loading(`Deleting ${pendingDocumentDeletions.length} document(s)...`, { id: "delete-documents" });
        try {
          for (const url of pendingDocumentDeletions) {
            await clientDeleteFromSupabase(url, 'documents');
          }
          setPendingDocumentDeletions([]);
          toast.success("Documents deleted!", { id: "delete-documents" });
        } catch (error) {
          console.error("Error deleting documents:", error);
          toast.error("Failed to delete some documents", { id: "delete-documents" });
        }
      }

      // 4. Update dossier in database
      const result = await updateTenantDossier(updatedDossier);

      if (result.success) {
        // Clear field changes
        setFieldChanges({});
        // Refresh from backend - this will trigger re-initialization in EditableField components
        await fetchDossier();
        toast.success("All changes applied successfully");
      } else {
        toast.error(result.message || "Failed to update dossier");
      }
    } catch (error) {
      console.error("Error updating dossier:", error);
      toast.error("Failed to update dossier");
    } finally {
      setIsSaving(false);
    }
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!dossier?.profileInfo) return 'U';
    const firstName = dossier.profileInfo.first_name || '';
    const lastName = dossier.profileInfo.last_name || '';
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) return firstName[0].toUpperCase();
    if (lastName) return lastName[0].toUpperCase();
    return 'U';
  };


  if (isLoading) {
    return (
      <SidebarProvider>
        <TenantSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="text-center py-8">Loading dossier...</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!dossier) {
    return (
      <SidebarProvider>
        <TenantSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="text-center py-8">No dossier found</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My Dossier</h1>
              <p className="text-muted-foreground">
                Manage your tenant profile and information
              </p>
            </div>
            <Button
              onClick={handleApply}
              disabled={!hasChanges() || isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <>Applying Changes...</>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Apply Changes
                </>
              )}
            </Button>
          </div>

          {/* Avatar Section */}
          {dossier && (
            <AvatarUpload
              dossier={dossier}
              pendingAvatarPreview={pendingAvatarPreview}
              isSaving={isSaving}
              onAvatarUpload={handleAvatarUpload}
              getInitials={getInitials}
            />
          )}

          {dossier && originalDossier && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Profile Information */}
              <ProfileInfoSection
                dossier={dossier}
                originalDossier={originalDossier}
                fieldChanges={fieldChanges}
                dossierVersion={dossierVersion}
                isSaving={isSaving}
                onFieldChange={handleFieldChange}
                getFieldValue={getFieldValue}
                getOriginalValue={getOriginalValue}
              />

              {/* Employment Details */}
              <EmploymentDetailsSection
                dossier={dossier}
                originalDossier={originalDossier}
                fieldChanges={fieldChanges}
                dossierVersion={dossierVersion}
                isSaving={isSaving}
                onFieldChange={handleFieldChange}
                getFieldValue={getFieldValue}
                getOriginalValue={getOriginalValue}
              />

              {/* Application Information */}
              <ApplicationInfoSection
                dossier={dossier}
                originalDossier={originalDossier}
                fieldChanges={fieldChanges}
                dossierVersion={dossierVersion}
                isSaving={isSaving}
                onFieldChange={handleFieldChange}
                getFieldValue={getFieldValue}
                getOriginalValue={getOriginalValue}
              />

              {/* Additional Information */}
              <AdditionalInfoSection dossier={dossier} />
            </div>
          )}

          {/* Documents Section */}
          {dossier && (
            <DocumentList
              dossier={dossier}
              pendingDocumentDeletions={pendingDocumentDeletions}
              isSaving={isSaving}
              onDocumentUpload={handleDocumentUpload}
              onDeleteDocument={handleDeleteDocument}
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


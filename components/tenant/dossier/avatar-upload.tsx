'use client';
import { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { TenantDossier } from "@/data/models/user.model";

interface AvatarUploadProps {
  dossier: TenantDossier;
  pendingAvatarPreview: string | null;
  isSaving: boolean;
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  getInitials: () => string;
}

export function AvatarUpload({
  dossier,
  pendingAvatarPreview,
  isSaving,
  onAvatarUpload,
  getInitials
}: AvatarUploadProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Photo</CardTitle>
        <CardDescription>Upload your profile picture (JPEG/PNG, max 2MB)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <Avatar className="size-24">
            <AvatarImage
              src={pendingAvatarPreview || dossier.avatar_url}
              alt="Profile"
            />
            <AvatarFallback className="text-2xl">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => avatarInputRef.current?.click()}
              disabled={isSaving}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {dossier.avatar_url || pendingAvatarPreview ? 'Change Photo' : 'Upload Photo'}
            </Button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={onAvatarUpload}
              className="hidden"
            />
            {pendingAvatarPreview && (
              <p className="text-sm text-muted-foreground">
                New photo selected. Click "Apply Changes" to upload.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


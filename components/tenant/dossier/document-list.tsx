'use client';
import { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, FileText, Image as ImageIcon } from "lucide-react";
import { TenantDossier, DossierDocument } from "@/data/models/user.model";

interface DocumentListProps {
  dossier: TenantDossier;
  pendingDocumentDeletions: string[];
  isSaving: boolean;
  onDocumentUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteDocument: (index: number) => void;
}

export function DocumentList({
  dossier,
  pendingDocumentDeletions,
  isSaving,
  onDocumentUpload,
  onDeleteDocument
}: DocumentListProps) {
  const documentInputRef = useRef<HTMLInputElement>(null);
  const currentDocCount = dossier.uploaded_docs?.filter(doc => !(doc as any)._isPending).length || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              Upload and manage your documents (PDF, JPEG, PNG - max 2MB each, max 10 total)
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={() => documentInputRef.current?.click()}
            disabled={isSaving || currentDocCount >= 10}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Documents
          </Button>
          <input
            ref={documentInputRef}
            type="file"
            multiple
            accept="application/pdf,image/jpeg,image/jpg,image/png"
            onChange={onDocumentUpload}
            className="hidden"
          />
        </div>
      </CardHeader>
      <CardContent>
        {dossier.uploaded_docs && dossier.uploaded_docs.length > 0 ? (
          <div className="space-y-3">
            {dossier.uploaded_docs.map((doc, index) => {
              const isPending = (doc as any)._isPending;
              const isMarkedForDeletion = pendingDocumentDeletions.includes(doc.url);
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                    isMarkedForDeletion ? 'opacity-50 bg-muted' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {doc.type?.startsWith('image/') ? (
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {doc.name || `Document ${index + 1}`}
                        {isPending && (
                          <span className="ml-2 text-xs text-muted-foreground">(Pending upload)</span>
                        )}
                        {isMarkedForDeletion && (
                          <span className="ml-2 text-xs text-destructive">(Will be deleted)</span>
                        )}
                      </p>
                      {!isPending && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-primary truncate block"
                        >
                          View document
                        </a>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDeleteDocument(index)}
                    className="flex-shrink-0"
                    disabled={isSaving}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No documents uploaded yet</p>
            <p className="text-sm">Click "Upload Documents" to add files</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


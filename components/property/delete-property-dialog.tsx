'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { AlertTriangle } from 'lucide-react';

interface DeletePropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyTitle?: string;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeletePropertyDialog({
  open,
  onOpenChange,
  propertyTitle,
  onConfirm,
  isDeleting = false,
}: DeletePropertyDialogProps) {
  const [confirmText, setConfirmText] = useState('');
  const requiredText = 'delete';
  const isConfirmValid = confirmText.toLowerCase() === requiredText;

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText('');
      onOpenChange(false);
    }
  };

  const handleConfirm = () => {
    if (isConfirmValid) {
      onConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="size-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Delete Property</DialogTitle>
              <DialogDescription className="mt-1">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-foreground">
              "{propertyTitle || 'this property'}"
            </span>
            ? This will permanently remove the property and all its data.
          </p>
          
          <Field>
            <FieldLabel htmlFor="confirm-delete">
              Type <span className="font-mono font-semibold">delete</span> to confirm:
            </FieldLabel>
            <Input
              id="confirm-delete"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="delete"
              disabled={isDeleting}
              className="font-mono"
            />
            {confirmText && !isConfirmValid && (
              <FieldError errors={[{ message: `Please type "${requiredText}" to confirm` }]} />
            )}
          </Field>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmValid || isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Property'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


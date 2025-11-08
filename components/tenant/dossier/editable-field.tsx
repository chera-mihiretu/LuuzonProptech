'use client';
import { useEffect, useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TenantDossier } from "@/data/models/user.model";

interface EditableFieldProps {
  label: string;
  fieldPath: string;
  type?: string;
  options?: { value: string; label: string }[];
  multiline?: boolean;
  dossier: TenantDossier | null;
  originalDossier: TenantDossier | null;
  fieldChanges: Record<string, any>;
  dossierVersion: number;
  isSaving: boolean;
  onFieldChange: (fieldPath: string, value: any) => void;
  getFieldValue: (fieldPath: string) => any;
  getOriginalValue: (fieldPath: string) => any;
}

export function EditableField({
  label,
  fieldPath,
  type = "text",
  options,
  multiline = false,
  dossier,
  originalDossier,
  fieldChanges,
  dossierVersion,
  isSaving,
  onFieldChange,
  getFieldValue,
  getOriginalValue
}: EditableFieldProps) {
  const getCurrentValue = () => {
    if (!dossier) return '';
    const parts = fieldPath.split('.');
    let current: any = dossier;
    for (const part of parts) {
      if (current === null || current === undefined) {
        current = '';
        break;
      }
      current = current[part];
    }
    return String(current ?? '');
  };

  const [localValue, setLocalValue] = useState<string>(getCurrentValue);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>(null);
  const shouldRestoreFocusRef = useRef(false);
  const selectionRef = useRef<{ start: number | null; end: number | null } | null>(null);

  // When dossierVersion changes (fresh data from backend), reset local value
  useEffect(() => {
    setLocalValue(getCurrentValue());
  }, [dossierVersion, fieldPath]);

  if (!dossier) return null;

  const currentValue = getFieldValue(fieldPath);
  const originalValue = getOriginalValue(fieldPath);
  const hasChanged = String(currentValue) !== String(originalValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = e.target.value;

    if (inputRef.current && document.activeElement === inputRef.current) {
      shouldRestoreFocusRef.current = true;
      if ('selectionStart' in inputRef.current && 'selectionEnd' in inputRef.current) {
        selectionRef.current = {
          start: (inputRef.current as HTMLInputElement | HTMLTextAreaElement).selectionStart,
          end: (inputRef.current as HTMLInputElement | HTMLTextAreaElement).selectionEnd
        };
      } else {
        selectionRef.current = null;
      }
    } else {
      shouldRestoreFocusRef.current = false;
      selectionRef.current = null;
    }

    setLocalValue(newValue);
    const finalValue = type === "number" ? parseFloat(newValue) || 0 : newValue;
    onFieldChange(fieldPath, finalValue);
  };

  useEffect(() => {
    if (shouldRestoreFocusRef.current && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
      // Number inputs don't support setSelectionRange, so skip it for number type
      if (selectionRef.current && 'setSelectionRange' in inputRef.current && type !== "number") {
        const start = selectionRef.current.start ?? inputRef.current.value.length;
        const end = selectionRef.current.end ?? inputRef.current.value.length;
        try {
          (inputRef.current as HTMLInputElement | HTMLTextAreaElement).setSelectionRange(start, end);
        } catch (error) {
          // Ignore errors for inputs that don't support selection (e.g., number inputs)
          console.debug("Could not set selection range:", error);
        }
      }
      shouldRestoreFocusRef.current = false;
    }
  }, [localValue, type]);

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldPath}>{label}</Label>
      <div className="relative">
        {multiline ? (
          <Textarea
            id={fieldPath}
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={localValue}
            onChange={handleChange}
            disabled={isSaving}
            className="min-h-[100px]"
          />
        ) : type === "select" && options ? (
          <select
            id={fieldPath}
            ref={inputRef as React.RefObject<HTMLSelectElement>}
            value={localValue}
            onChange={handleChange}
            disabled={isSaving}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <Input
            id={fieldPath}
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={type}
            value={localValue}
            onChange={handleChange}
            disabled={isSaving}
          />
        )}
        {hasChanged && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <div className="h-2 w-2 rounded-full bg-green-500" title="Changed" />
          </div>
        )}
      </div>
    </div>
  );
}


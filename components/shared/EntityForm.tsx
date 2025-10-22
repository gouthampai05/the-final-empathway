import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'textarea' | 'multiselect' | 'datetime-local';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

interface EntityFormProps<T extends Record<string, unknown>> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  fields: FormField[];
  formData: T;
  onFormDataChange: (updates: Partial<T>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
  submitText: string;
}

export function EntityForm<T extends Record<string, unknown>>({
  open,
  onOpenChange,
  title,
  description,
  fields,
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  isLoading,
  submitText
}: EntityFormProps<T>) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name];
    const stringValue = typeof value === 'string' ? value : '';
    const arrayValue = Array.isArray(value) ? value : [];

    switch (field.type) {
      case 'select':
        return (
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={stringValue}
            onChange={(e) => onFormDataChange({ [field.name]: e.target.value } as Partial<T>)}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={field.placeholder}
            value={stringValue}
            onChange={(e) => onFormDataChange({ [field.name]: e.target.value } as Partial<T>)}
            required={field.required}
          />
        );

      case 'multiselect':
        // Simple implementation - you might want to use a proper multiselect component
        return (
          <input
            type="text"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={field.placeholder || "Enter tags separated by commas"}
            value={arrayValue.join(', ')}
            onChange={(e) => {
              const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
              onFormDataChange({ [field.name]: tags } as Partial<T>);
            }}
            required={field.required}
          />
        );

      default:
        return (
          <input
            type={field.type}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={field.placeholder}
            value={stringValue}
            onChange={(e) => onFormDataChange({ [field.name]: e.target.value } as Partial<T>)}
            required={field.required}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {fields.map((field) => (
              <div key={field.name} className="grid gap-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, useEffect } from "react";
import { ImageIcon, X, Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadMultipleToSupabase } from "@/lib/supabase-client";
import { updateProperty } from "@/app/api/agency/properties/manage-properties";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { propertySchema } from "@/app/zod_validation/property_validation";

type PropertyFormValues = z.output<typeof propertySchema>;

interface PropertyImagePreview {
  url: string;
  description?: string;
  file?: File;
  isExisting?: boolean; // true if this image already exists in the database
}

interface EditPropertyFormProps {
  property: {
    _id?: string;
    title?: string;
    description?: string;
    price?: number;
    currency?: string;
    status?: 'listed' | 'rented' | 'archived';
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    longitude?: number;
    latitude?: number;
    property_images?: Array<{ url: string; description?: string }>;
    amenities?: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditPropertyForm({ property, onSuccess, onCancel }: EditPropertyFormProps) {
  const [images, setImages] = useState<PropertyImagePreview[]>([]);
  const [previewImage, setPreviewImage] = useState<{ url: string; description?: string } | null>(null);
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema) as any,
    mode: "onChange",
    defaultValues: {
      title: property.title || "",
      description: property.description || "",
      price: property.price,
      currency: property.currency || "EUR",
      status: property.status || "listed",
      address: property.address || "",
      city: property.city || "",
      state: property.state || "",
      country: property.country || "",
      longitude: property.longitude,
      latitude: property.latitude,
      amenities: property.amenities || "",
    },
  });

  // Reset form when property changes
  useEffect(() => {
    form.reset({
      title: property.title || "",
      description: property.description || "",
      price: property.price,
      currency: property.currency || "EUR",
      status: property.status || "listed",
      address: property.address || "",
      city: property.city || "",
      state: property.state || "",
      country: property.country || "",
      longitude: property.longitude,
      latitude: property.latitude,
      amenities: property.amenities || "",
    });
  }, [property, form]);

  // Initialize images from existing property and reset removed images
  useEffect(() => {
    setRemovedImageUrls([]);
    if (property.property_images && property.property_images.length > 0) {
      const existingImages: PropertyImagePreview[] = property.property_images.map(img => ({
        url: img.url,
        description: img.description || "",
        isExisting: true,
      }));
      setImages(existingImages);
    } else {
      setImages([]);
    }
  }, [property.property_images, property._id]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setImages((prev) => [
          ...prev,
          {
            url,
            description: "",
            file,
            isExisting: false, // New image to be uploaded
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const imageToRemove = images[index];
    
    // If it's an existing image, add its URL to the removal list
    if (imageToRemove.isExisting && imageToRemove.url) {
      setRemovedImageUrls((prev) => [...prev, imageToRemove.url]);
    }
    
    // Remove from the images array
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageDescriptionChange = (index: number, description: string) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, description } : img))
    );
  };

  async function onSubmit(values: PropertyFormValues) {
    try {
      // Upload new images to Supabase first and maintain description mapping
      const propertyImages: Array<{ url: string; description?: string }> = [];
      
      // Separate images into existing and new
      const newImageFiles: Array<{ file: File; description: string }> = [];
      
      // Collect new files to upload
      images.forEach((img) => {
        if (!img.isExisting && img.file) {
          newImageFiles.push({
            file: img.file,
            description: img.description || "",
          });
        }
      });
      
      // Upload new images if any
      let uploadedUrls: string[] = [];
      if (newImageFiles.length > 0) {
        toast.loading("Uploading new images...", { id: "upload-images" });
        
        try {
          const filesToUpload = newImageFiles.map(item => item.file);
          uploadedUrls = await uploadMultipleToSupabase(filesToUpload);
          toast.success("New images uploaded successfully!", { id: "upload-images" });
        } catch (uploadError) {
          toast.error("Failed to upload new images. Please try again.", { id: "upload-images" });
          console.error("Image upload error:", uploadError);
          return;
        }
      }
      
      // Build propertyImages array maintaining the order from the images array
      let newImageIndex = 0;
      images.forEach((img) => {
        if (img.isExisting && !img.file) {
          // Existing image - keep as is
          propertyImages.push({
            url: img.url,
            description: img.description || undefined,
          });
        } else if (!img.isExisting && img.file) {
          // Newly uploaded image
          propertyImages.push({
            url: uploadedUrls[newImageIndex],
            description: newImageFiles[newImageIndex].description || undefined,
          });
          newImageIndex++;
        }
      });

      // Prepare property data
      const propertyData = {
        ...values,
        location_point: values.longitude && values.latitude
          ? {
              type: "Point" as const,
              coordinates: [values.longitude, values.latitude] as [number, number],
            }
          : undefined,
        property_images: propertyImages,
      };

      // Submit to backend API
      toast.loading("Updating property...", { id: "update-property" });
      
      const result = await updateProperty(
        property._id || "",
        propertyData,
        removedImageUrls.length > 0 ? removedImageUrls : undefined
      );

      if (result.success) {
        toast.success("Property updated successfully!", { id: "update-property" });
        onSuccess?.();
      } else {
        toast.error(result.message || "Failed to update property. Please try again.", { id: "update-property" });
      }
    } catch (error) {
      toast.error("Failed to update property. Please try again.", { id: "update-property" });
      console.error(error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">Title *</FieldLabel>
          <Input
            id="title"
            type="text"
            placeholder="e.g., Modern Apartment in Paris"
            {...form.register("title")}
          />
          <FieldError errors={[{ message: form.formState.errors.title?.message }]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            placeholder="Describe the property..."
            rows={4}
            {...form.register("description")}
          />
          <FieldError errors={[{ message: form.formState.errors.description?.message }]} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="price">Price *</FieldLabel>
            <Input
              id="price"
              type="number"
              placeholder="0"
              {...form.register("price", { valueAsNumber: true })}
            />
            <FieldError errors={[{ message: form.formState.errors.price?.message }]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="currency">Currency *</FieldLabel>
            <Input
              id="currency"
              type="text"
              placeholder="EUR"
              {...form.register("currency")}
            />
            <FieldError errors={[{ message: form.formState.errors.currency?.message }]} />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="status">Status *</FieldLabel>
          <select
            id="status"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring md:text-sm"
            {...form.register("status")}
          >
            <option value="listed">Listed</option>
            <option value="rented">Rented</option>
            <option value="archived">Archived</option>
          </select>
          <FieldError errors={[{ message: form.formState.errors.status?.message }]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="address">Address *</FieldLabel>
          <Input
            id="address"
            type="text"
            placeholder="Street address"
            {...form.register("address")}
          />
          <FieldError errors={[{ message: form.formState.errors.address?.message }]} />
        </Field>

        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel htmlFor="city">City *</FieldLabel>
            <Input
              id="city"
              type="text"
              placeholder="City"
              {...form.register("city")}
            />
            <FieldError errors={[{ message: form.formState.errors.city?.message }]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="state">State *</FieldLabel>
            <Input
              id="state"
              type="text"
              placeholder="State"
              {...form.register("state")}
            />
            <FieldError errors={[{ message: form.formState.errors.state?.message }]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="country">Country *</FieldLabel>
            <Input
              id="country"
              type="text"
              placeholder="Country"
              {...form.register("country")}
            />
            <FieldError errors={[{ message: form.formState.errors.country?.message }]} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="longitude">Longitude</FieldLabel>
            <Input
              id="longitude"
              type="number"
              step="any"
              placeholder="-180 to 180"
              {...form.register("longitude")}
            />
            <FieldError errors={[{ message: form.formState.errors.longitude?.message }]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="latitude">Latitude</FieldLabel>
            <Input
              id="latitude"
              type="number"
              step="any"
              placeholder="-90 to 90"
              {...form.register("latitude")}
            />
            <FieldError errors={[{ message: form.formState.errors.latitude?.message }]} />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="amenities">Amenities</FieldLabel>
          <Input
            id="amenities"
            type="text"
            placeholder="e.g., WiFi, Parking, Elevator"
            {...form.register("amenities")}
          />
          <FieldDescription>Separate amenities with commas</FieldDescription>
          <FieldError errors={[{ message: form.formState.errors.amenities?.message }]} />
        </Field>

        <Field>
          <FieldLabel>Property Images</FieldLabel>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="size-4" />
                Upload New Images
              </Button>
              <span className="text-sm text-muted-foreground">
                {images.length} image{images.length !== 1 ? 's' : ''} selected
              </span>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group border rounded-lg overflow-hidden"
                  >
                    <div className="aspect-video relative bg-muted cursor-pointer">
                      <img
                        src={image.url}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onClick={() => setPreviewImage({ url: image.url, description: image.description })}
                      />
                      {image.isExisting && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Existing
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                    <div className="p-2">
                      <Input
                        type="text"
                        placeholder="Image description (optional)"
                        value={image.description || ''}
                        onChange={(e) =>
                          handleImageDescriptionChange(index, e.target.value)
                        }
                        className="text-xs"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {images.length === 0 && (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <ImageIcon className="size-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No images selected. Click "Upload New Images" to add property photos.
                </p>
              </div>
            )}
          </div>
        </Field>

        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Updating..." : "Update Property"}
          </Button>
        </div>
      </FieldGroup>

      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
            {previewImage?.description && (
              <DialogDescription>{previewImage.description}</DialogDescription>
            )}
          </DialogHeader>
          {previewImage && (
            <div className="relative w-full flex items-center justify-center">
              <img
                src={previewImage.url}
                alt={previewImage.description || "Property image preview"}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </form>
  );
}


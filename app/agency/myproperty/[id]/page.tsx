'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AgenciesSidebar from '@/components/agency/agency-side-bar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ArrowRight, MapPin, Calendar, Edit, Trash2 } from 'lucide-react';
import { getPropertyById, deleteProperty } from '@/app/api/agency/properties/manage-properties';
import { toast } from 'sonner';
import { DeletePropertyDialog } from '@/components/property/delete-property-dialog';
import { EditPropertyForm } from '@/components/agency/property/edit-property-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PropertyImage {
  url: string;
  description?: string;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; description?: string } | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchProperty = async () => {
    try {
      setIsLoading(true);
      const result = await getPropertyById(propertyId);
      if (result.success && result.data) {
        setProperty(result.data);
      } else {
        toast.error(result.message || 'Property not found');
        router.push('/agency/myproperty');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Failed to load property');
      router.push('/agency/myproperty');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!property?._id) {
      toast.error('Invalid property selected');
      return;
    }

    try {
      setIsDeleting(true);
      toast.loading('Deleting property...', { id: 'delete-property' });

      const result = await deleteProperty(property._id);

      if (result.success) {
        toast.success('Property deleted successfully!', { id: 'delete-property' });
        router.push('/agency/myproperty');
      } else {
        toast.error(result.message || 'Failed to delete property', { id: 'delete-property' });
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('An error occurred while deleting the property', { id: 'delete-property' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'listed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rented':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const nextImage = () => {
    if (property?.property_images && property.property_images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.property_images.length);
    }
  };

  const prevImage = () => {
    if (property?.property_images && property.property_images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.property_images.length) % property.property_images.length);
    }
  };

  if (isLoading) {
    return (
      <AgenciesSidebar>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </AgenciesSidebar>
    );
  }

  if (!property) {
    return (
      <AgenciesSidebar>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Property Not Found</h2>
                <p className="text-muted-foreground mb-4">The property you're looking for doesn't exist or you don't have permission to view it.</p>
                <Button onClick={() => router.push('/agency/myproperty')}>
                  <ArrowLeft className="size-4 mr-2" />
                  Back to Properties
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AgenciesSidebar>
    );
  }

  const propertyImages: PropertyImage[] = property.property_images || [];
  const currentImage = propertyImages[currentImageIndex];

  return (
    <AgenciesSidebar>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/agency/myproperty')}
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{property.title || 'Untitled Property'}</h1>
              <p className="text-muted-foreground">
                {property.address && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    {[property.address, property.city, property.state, property.country]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(property.status)}`}
            >
              {property.status?.charAt(0).toUpperCase() + property.status?.slice(1)}
            </span>
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="size-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="size-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-video w-full overflow-hidden bg-muted rounded-t-lg">
                  {currentImage ? (
                    <>
                      <img
                        src={currentImage.url}
                        alt={currentImage.description || property.title || 'Property image'}
                        className="h-full w-full object-cover object-[top_right] cursor-pointer"
                        onClick={() => setPreviewImage({ url: currentImage.url, description: currentImage.description })}
                      />
                      {propertyImages.length > 1 && (
                        <>
                          <div className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                            {currentImageIndex + 1} / {propertyImages.length}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white shadow-lg"
                            onClick={prevImage}
                          >
                            <ArrowLeft className="size-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white shadow-lg"
                            onClick={nextImage}
                          >
                            <ArrowRight className="size-5" />
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <div className="mb-2 text-4xl">🏠</div>
                        <div className="text-sm">No image available</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Image Gallery */}
            {propertyImages.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>All Images</CardTitle>
                  <CardDescription>{propertyImages.length} images</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    {propertyImages.map((img: PropertyImage, index: number) => (
                      <div
                        key={index}
                        className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          index === currentImageIndex
                            ? 'border-primary'
                            : 'border-transparent hover:border-primary/50'
                        }`}
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setPreviewImage({ url: img.url, description: img.description });
                        }}
                      >
                        <img
                          src={img.url}
                          alt={img.description || `Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {img.description && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                            {img.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {property.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{property.description}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card>
              <CardHeader>
                <CardTitle>Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">
                    {property.price?.toLocaleString() || 'N/A'}
                  </span>
                  {property.price && (
                    <span className="text-lg text-muted-foreground">
                      {property.currency || 'EUR'}
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Address</div>
                    <div className="font-medium">{property.address || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">City</div>
                    <div className="font-medium">{property.city || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">State</div>
                    <div className="font-medium">{property.state || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Country</div>
                    <div className="font-medium">{property.country || 'N/A'}</div>
                  </div>
                  {property.location_point?.coordinates && (
                    <>
                      <div>
                        <div className="text-sm text-muted-foreground">Longitude</div>
                        <div className="font-medium">{property.location_point.coordinates[0]}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Latitude</div>
                        <div className="font-medium">{property.location_point.coordinates[1]}</div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            {property.amenities && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.split(',').map((amenity: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                      >
                        {amenity.trim()}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">
                    {property.created_at ? new Date(property.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                {property.updated_at && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Updated:</span>
                    <span className="font-medium">
                      {new Date(property.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog 
          open={isEditDialogOpen} 
          onOpenChange={(open) => {
            if (!open) {
              setIsEditDialogOpen(false);
            }
          }}
        >
          <DialogContent 
            className="max-w-3xl max-h-[90vh] overflow-y-auto"
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Edit Property</DialogTitle>
              <DialogDescription>
                Update the property details below.
              </DialogDescription>
            </DialogHeader>
            {property && (
              <EditPropertyForm
                property={{
                  ...property,
                  longitude: property.location_point?.coordinates?.[0],
                  latitude: property.location_point?.coordinates?.[1],
                }}
                onSuccess={() => {
                  setIsEditDialogOpen(false);
                  fetchProperty();
                }}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <DeletePropertyDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          propertyTitle={property?.title}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />

        {/* Image Preview Dialog */}
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
                  alt={previewImage.description || 'Property image preview'}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AgenciesSidebar>
  );
}


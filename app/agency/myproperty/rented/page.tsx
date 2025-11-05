'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AgenciesSidebar from "@/components/agency/agency-side-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { AddPropertyForm } from "@/components/agency/property/add-property-form";
import { EditPropertyForm } from "@/components/agency/property/edit-property-form";
import { getMyProperties, deleteProperty } from "@/app/api/agency/properties/manage-properties";
import { PropertyList } from "@/components/property/property-list";
import { DeletePropertyDialog } from "@/components/property/delete-property-dialog";
import { toast } from "sonner";


export default function RentedPropertiesPage() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<any>(null);
  const [propertyToDelete, setPropertyToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 12
  });

  const fetchProperties = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const result = await getMyProperties(page, 12, 'rented');
      if (result.success && result.data) {
        setProperties(result.data);
        if (result.pagination) {
          setPagination(result.pagination);
        }
      } else if (Array.isArray(result)) {
        setProperties(result);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePropertyClick = (property: any) => {
    if (property._id) {
      router.push(`/agency/myproperty/${property._id}`);
    }
  };

  const handleUpdate = (property: any) => {
    const propertyWithCoords = {
      ...property,
      longitude: property.location_point?.coordinates?.[0],
      latitude: property.location_point?.coordinates?.[1],
    };
    setPropertyToEdit(propertyWithCoords);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (property: any) => {
    setPropertyToDelete(property);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!propertyToDelete?._id) {
      toast.error("Invalid property selected");
      return;
    }

    try {
      setIsDeleting(true);
      toast.loading("Deleting property...", { id: "delete-property" });

      const result = await deleteProperty(propertyToDelete._id);

      if (result.success) {
        toast.success("Property deleted successfully!", { id: "delete-property" });
        setIsDeleteDialogOpen(false);
        setPropertyToDelete(null);
        await fetchProperties(currentPage);
      } else {
        toast.error(result.message || "Failed to delete property", { id: "delete-property" });
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("An error occurred while deleting the property", { id: "delete-property" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AgenciesSidebar>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Rented Properties</h1>
            <p className="text-muted-foreground">
              Manage and view your rented properties
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push('/agency/myproperty')}>Listed</Button>
            <Button variant="secondary">Rented</Button>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="size-4" />
              Add Property
            </Button>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setIsDialogOpen(false);
          }
        }}>
          <DialogContent 
            className="max-w-3xl max-h-[90vh] overflow-y-auto"
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new property to your listings.
              </DialogDescription>
            </DialogHeader>
            <AddPropertyForm
              onSuccess={() => {
                setIsDialogOpen(false);
                fetchProperties(currentPage);
              }}
            />
          </DialogContent>
        </Dialog>

        <Dialog 
          open={isEditDialogOpen} 
          onOpenChange={(open) => {
            if (!open) {
              setIsEditDialogOpen(false);
              setPropertyToEdit(null);
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
            {propertyToEdit && (
              <EditPropertyForm
                property={propertyToEdit}
                onSuccess={() => {
                  setIsEditDialogOpen(false);
                  setPropertyToEdit(null);
                  fetchProperties(currentPage);
                }}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setPropertyToEdit(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        <DeletePropertyDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          propertyTitle={propertyToDelete?.title}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />

        <div>
          <PropertyList
            properties={properties}
            isLoading={isLoading}
            pagination={pagination.totalPages > 0 ? pagination : undefined}
            onPageChange={handlePageChange}
            onPropertyClick={handlePropertyClick}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </AgenciesSidebar>
  );
}



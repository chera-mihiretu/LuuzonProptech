'use client';
import { useState } from "react";
import AgenciesSidebar from "@/components/agency/agency-side-bar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, MapPin, Euro, Home } from "lucide-react";
import { PropertyModel } from "@/data/models/property.model";
import { AddPropertyForm } from "@/components/property/add-property-form";

// Dummy data for properties
const dummyProperties: Omit<PropertyModel, '_id' | 'agency_id'>[] = [
  {
    user_id: "user-1",
    title: "Modern Apartment in Paris",
    description: "Beautiful 2-bedroom apartment with stunning city views",
    price: 1200,
    currency: "EUR",
    status: "listed",
    address: "123 Rue de la Paix",
    city: "Paris",
    state: "Île-de-France",
    country: "France",
    location_point: {
      type: "Point",
      coordinates: [2.3522, 48.8566]
    },
    property_images: [
      { url: "/placeholder.svg", description: "Living room" },
      { url: "/placeholder.svg", description: "Kitchen" }
    ],
    amenities: "WiFi, Parking, Elevator",
    unique_link: "property-001",
    created_at: new Date("2024-01-15"),
    updated_at: new Date("2024-01-20")
  },
  {
    user_id: "user-1",
    title: "Luxury Villa in Nice",
    description: "Spacious 3-bedroom villa near the beach with private pool",
    price: 2500,
    currency: "EUR",
    status: "rented",
    address: "45 Promenade des Anglais",
    city: "Nice",
    state: "Provence-Alpes-Côte d'Azur",
    country: "France",
    location_point: {
      type: "Point",
      coordinates: [7.2619, 43.7102]
    },
    property_images: [
      { url: "/placeholder.svg", description: "Exterior view" },
      { url: "/placeholder.svg", description: "Pool area" }
    ],
    amenities: "Pool, WiFi, Parking, Garden",
    unique_link: "property-002",
    created_at: new Date("2024-01-10"),
    updated_at: new Date("2024-02-01")
  },
  {
    user_id: "user-1",
    title: "Cozy Studio in Lyon",
    description: "Compact studio perfect for students or professionals",
    price: 650,
    currency: "EUR",
    status: "listed",
    address: "78 Rue de la République",
    city: "Lyon",
    state: "Auvergne-Rhône-Alpes",
    country: "France",
    location_point: {
      type: "Point",
      coordinates: [4.8357, 45.7640]
    },
    property_images: [
      { url: "/placeholder.svg", description: "Studio view" }
    ],
    amenities: "WiFi, Furnished",
    unique_link: "property-003",
    created_at: new Date("2024-02-05"),
    updated_at: new Date("2024-02-05")
  },
  {
    user_id: "user-1",
    title: "Family House in Bordeaux",
    description: "4-bedroom house with garden, perfect for families",
    price: 1800,
    currency: "EUR",
    status: "listed",
    address: "12 Avenue de la Gare",
    city: "Bordeaux",
    state: "Nouvelle-Aquitaine",
    country: "France",
    location_point: {
      type: "Point",
      coordinates: [-0.5792, 44.8378]
    },
    property_images: [
      { url: "/placeholder.svg", description: "House exterior" },
      { url: "/placeholder.svg", description: "Garden" },
      { url: "/placeholder.svg", description: "Kitchen" }
    ],
    amenities: "Garden, Parking, WiFi, Garage",
    unique_link: "property-004",
    created_at: new Date("2024-01-25"),
    updated_at: new Date("2024-02-10")
  },
  {
    user_id: "user-1",
    title: "Penthouse in Marseille",
    description: "Luxury penthouse with panoramic sea views",
    price: 3000,
    currency: "EUR",
    status: "archived",
    address: "5 Corniche Kennedy",
    city: "Marseille",
    state: "Provence-Alpes-Côte d'Azur",
    country: "France",
    location_point: {
      type: "Point",
      coordinates: [5.3698, 43.2965]
    },
    property_images: [
      { url: "/placeholder.svg", description: "Sea view" },
      { url: "/placeholder.svg", description: "Terrace" }
    ],
    amenities: "Sea View, WiFi, Parking, Elevator, Balcony",
    unique_link: "property-005",
    created_at: new Date("2023-12-01"),
    updated_at: new Date("2024-01-15")
  }
];

const getStatusBadgeColor = (status: string) => {
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

export default function MyPropertyPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <AgenciesSidebar>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Properties</h1>
            <p className="text-muted-foreground">
              Manage and view all your listed properties
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="size-4" />
            Add Property
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          // Only allow closing if explicitly set to false (from form success or X button)
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
              onSuccess={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader>
            <CardTitle>Properties List</CardTitle>
            <CardDescription>
              {dummyProperties.length} total properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyProperties.map((property, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Home className="size-4 text-muted-foreground" />
                        {property.title || "Untitled Property"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="size-3" />
                        <span className="text-sm">
                          {property.city}, {property.country}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Euro className="size-3" />
                        <span className="font-medium">
                          {property.price?.toLocaleString() || "N/A"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          /month
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeColor(property.status)}`}
                      >
                        {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {property.created_at?.toLocaleDateString()  || ""}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AgenciesSidebar>
  );
}

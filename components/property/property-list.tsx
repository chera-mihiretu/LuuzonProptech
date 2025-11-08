'use client';

import { PropertyCard } from './property-card';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';

interface PropertyImage {
  url: string;
  description?: string;
}

interface Property {
  _id?: string;
  title?: string;
  price?: number;
  currency?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  status?: 'listed' | 'rented' | 'archived';
  property_images?: PropertyImage[];
  created_at?: string;
}

interface PropertyListProps {
  properties: Property[];
  isLoading?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  onPageChange?: (page: number) => void;
  onPropertyClick?: (property: Property) => void;
  onUpdate?: (property: Property) => void;
  onDelete?: (property: Property) => void;
}

export function PropertyList({
  properties,
  isLoading = false,
  pagination,
  onPageChange,
  onPropertyClick,
  onUpdate,
  onDelete,
}: PropertyListProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[4/3] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 text-6xl">🏠</div>
        <h3 className="mb-2 text-lg font-semibold">No properties found</h3>
        <p className="text-sm text-muted-foreground">
          Add your first property to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {properties.map((property) => (
          <PropertyCard
            key={property._id || `property-${Math.random()}`}
            {...property}
            onClick={() => onPropertyClick?.(property)}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{' '}
            {Math.min(
              pagination.currentPage * pagination.itemsPerPage,
              pagination.totalItems
            )}{' '}
            of {pagination.totalItems} properties
          </div>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange || (() => {})}
          />
        </div>
      )}
    </div>
  );
}


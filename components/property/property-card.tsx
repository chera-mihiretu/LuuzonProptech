'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MapPin, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PropertyImage {
  url: string;
  description?: string;
}

interface PropertyCardProps {
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
  onClick?: () => void;
  onUpdate?: (property: any) => void;
  onDelete?: (property: any) => void;
}

export function PropertyCard({
  _id,
  title,
  price,
  currency = 'EUR',
  address,
  city,
  state,
  country,
  status = 'listed',
  property_images = [],
  created_at,
  onClick,
  onUpdate,
  onDelete,
}: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasMultipleImages = property_images.length > 1;

  // Reset image index when property changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [_id]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property_images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property_images.length) % property_images.length);
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

  const currentImage = property_images[currentImageIndex];

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-xl border-border p-0"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted rounded-t-xl">
        {currentImage ? (
          <>
            <img
              src={currentImage.url}
              alt={currentImage.description || title || 'Property image'}
              className="h-full w-full object-cover object-[top_right] transition-transform duration-300 group-hover:scale-105"
            />
            {hasMultipleImages && (
              <>
                {/* Image counter badge */}
                <div className="absolute top-2 right-12 rounded-full bg-black/60 px-2 py-1 text-xs text-white z-10">
                  {currentImageIndex + 1} / {property_images.length}
                </div>
                
                {/* Previous button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "absolute left-2 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white shadow-lg opacity-0 transition-all duration-200 z-10",
                    "group-hover:opacity-100 hover:scale-110"
                  )}
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="size-5" />
                </Button>

                {/* Next button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white shadow-lg opacity-0 transition-all duration-200 z-10",
                    "group-hover:opacity-100 hover:scale-110"
                  )}
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <ChevronRight className="size-5" />
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

        {/* Status badge */}
        <div className="absolute top-2 left-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
              getStatusColor(status)
            )}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        {/* Menu button */}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 bg-white/95 hover:bg-white shadow-lg opacity-0 transition-all duration-200 z-20",
                  "group-hover:opacity-100 hover:scale-110"
                )}
                onClick={(e) => e.stopPropagation()}
                aria-label="Property options"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate?.({ _id, title, price, currency, address, city, state, country, status, property_images, created_at });
                }}
              >
                <Pencil className="size-4" />
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.({ _id, title, price, currency, address, city, state, country, status, property_images, created_at });
                }}
              >
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">
            {title || 'Untitled Property'}
          </h3>
          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3" />
            <span className="line-clamp-1">
              {[address, city, state, country].filter(Boolean).join(', ')}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">
              {price?.toLocaleString() || 'N/A'}
            </span>
            {price && (
              <span className="text-sm text-muted-foreground">
                {currency}
              </span>
            )}
          </div>
          {created_at && (
            <div className="text-xs text-muted-foreground">
              {new Date(created_at).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}


'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TenantSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { PropertyList } from "@/components/property/property-list";
import { getTenantProperties } from "@/app/api/tenant/properties/get-properties";
import { updateLastSignIn } from "@/app/api/auth/update-last-signin";

export default function TenantDashboard() {
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 12
  });

  useEffect(() => {
    // Update last_sign_in when dashboard loads
    updateLastSignIn().catch((error) => {
      console.error("Failed to update last_sign_in:", error);
    });
  }, []);

  const fetchProperties = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const result = await getTenantProperties(page, 12);
      if (result.success && result.data) {
        setProperties(result.data);
        if (result.pagination) {
          setPagination(result.pagination);
        }
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
      router.push(`/tenant/properties/${property._id}`);
    }
  };

  return (
    <SidebarProvider>
      <TenantSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Available Properties</h1>
            <p className="text-muted-foreground">
              Browse properties from multiple agencies
            </p>
          </div>

          <PropertyList
            properties={properties}
            isLoading={isLoading}
            pagination={pagination.totalPages > 0 ? pagination : undefined}
            onPageChange={handlePageChange}
            onPropertyClick={handlePropertyClick}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

'use client';

import { useState, useEffect } from 'react';
import AgenciesSidebar from "@/components/agency/agency-side-bar";
import { ApplicationList } from "@/components/agency/applications/application-list";
import { DossierDialog } from "@/components/agency/applications/dossier-dialog";
import { getAgencyApplications } from "@/app/api/agency/applications/get-applications";
import { TenantDossier } from "@/data/models/user.model";
import { toast } from "sonner";

export default function AgencyApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [selectedDossier, setSelectedDossier] = useState<TenantDossier | null>(null);
  const [selectedTenantName, setSelectedTenantName] = useState<string>('');
  const [isDossierDialogOpen, setIsDossierDialogOpen] = useState(false);

  const fetchApplications = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const result = await getAgencyApplications(page, 10);
      if (result.success && result.data) {
        setApplications(result.data);
        if (result.pagination) {
          setPagination(result.pagination);
        }
      } else {
        toast.error(result.message || 'Failed to fetch applications');
        setApplications([]);
        setPagination({
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 10
        });
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error('Failed to load applications');
      setApplications([]);
      setPagination({
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 10
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      await fetchApplications(currentPage);
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDossier = (dossier: TenantDossier, tenantName: string) => {
    setSelectedDossier(dossier);
    setSelectedTenantName(tenantName);
    setIsDossierDialogOpen(true);
  };

  return (
    <AgenciesSidebar>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
            <p className="text-muted-foreground">
              View and manage property applications from tenants
            </p>
          </div>
        </div>

        <ApplicationList
          applications={applications}
          isLoading={isLoading}
          pagination={pagination.totalPages > 0 ? pagination : undefined}
          onPageChange={handlePageChange}
          onViewDossier={handleViewDossier}
        />

        <DossierDialog
          open={isDossierDialogOpen}
          onOpenChange={setIsDossierDialogOpen}
          dossier={selectedDossier}
          tenantName={selectedTenantName}
        />
      </div>
    </AgenciesSidebar>
  );
}

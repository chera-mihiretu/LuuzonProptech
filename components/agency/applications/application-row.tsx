'use client';

import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { ApplicationStatus } from "@/data/models/application.model";

interface ApplicationRowProps {
  application: {
    id: string;
    tenant_id: string;
    property_id: string;
    status: ApplicationStatus;
    created_at: string;
    updated_at: string;
    property?: {
      _id: string;
      title?: string;
      address?: string;
      city?: string;
      price?: number;
      currency?: string;
    };
    tenant?: {
      _id: string;
      name: string;
      email: string;
      dossier?: any;
    };
  };
  onViewDossier: (dossier: any, tenantName: string) => void;
}

export function ApplicationRow({ application, onViewDossier }: ApplicationRowProps) {
  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.PENDING:
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500";
      case ApplicationStatus.ACCEPTED:
        return "bg-green-500/10 text-green-600 dark:text-green-500";
      case ApplicationStatus.REJECTED:
        return "bg-red-500/10 text-red-600 dark:text-red-500";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  const propertyTitle = application.property?.title || 'N/A';
  const propertyAddress = application.property?.address 
    ? `${application.property.address}${application.property.city ? `, ${application.property.city}` : ''}`
    : 'N/A';
  const propertyPrice = application.property?.price
    ? `${application.property.price.toLocaleString()} ${application.property.currency || '€'}`
    : 'N/A';
  const tenantName = application.tenant?.name || 'Unknown';
  const tenantEmail = application.tenant?.email || 'N/A';
  const hasDossier = !!application.tenant?.dossier;

  return (
    <TableRow>
      <TableCell className="font-medium">{propertyTitle}</TableCell>
      <TableCell className="text-muted-foreground">{propertyAddress}</TableCell>
      <TableCell className="text-muted-foreground">{propertyPrice}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{tenantName}</span>
          <span className="text-sm text-muted-foreground">{tenantEmail}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor(application.status)}>
          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(application.created_at)}
      </TableCell>
      <TableCell>
        {hasDossier ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDossier(application.tenant!.dossier, tenantName)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            View Dossier
          </Button>
        ) : (
          <span className="text-sm text-muted-foreground">No dossier</span>
        )}
      </TableCell>
    </TableRow>
  );
}


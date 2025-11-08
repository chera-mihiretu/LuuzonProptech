'use client';
import { useEffect } from 'react';
import AgenciesSidebar from "@/components/agency/agency-side-bar";
import { updateLastSignIn } from "@/app/api/auth/update-last-signin";
import { KPICard } from "@/components/agency/kpi-card";
import { RevenueChart } from "@/components/agency/revenue-chart";
import { PropertiesChart } from "@/components/agency/properties-chart";
import { SupportTicketsChart } from "@/components/agency/support-tickets-chart";
import { 
  Home, 
  List, 
  Euro, 
  AlertCircle, 
  Ticket 
} from "lucide-react";

// Dummy data for KPIs
const kpiData = {
  rentedAssets: 24,
  listedAssets: 45,
  collectedRent: 125000,
  dueRent: 35000,
  openTickets: 8,
};

// Dummy data for charts
const revenueData = [
  { month: "Jan", collected: 98000, due: 42000 },
  { month: "Feb", collected: 105000, due: 38000 },
  { month: "Mar", collected: 112000, due: 35000 },
  { month: "Apr", collected: 118000, due: 32000 },
  { month: "May", collected: 125000, due: 35000 },
  { month: "Jun", collected: 132000, due: 30000 },
];

const propertiesData = [
  { month: "Jan", listed: 38, rented: 18 },
  { month: "Feb", listed: 40, rented: 20 },
  { month: "Mar", listed: 42, rented: 21 },
  { month: "Apr", listed: 43, rented: 22 },
  { month: "May", listed: 44, rented: 23 },
  { month: "Jun", listed: 45, rented: 24 },
];

const supportTicketsData = [
  { month: "Jan", tickets: 12 },
  { month: "Feb", tickets: 10 },
  { month: "Mar", tickets: 9 },
  { month: "Apr", tickets: 11 },
  { month: "May", tickets: 8 },
  { month: "Jun", tickets: 8 },
];

export default function AgencyDashboardPage() {
  useEffect(() => {
    // Update last_sign_in when dashboard loads
    updateLastSignIn().catch((error) => {
      console.error("Failed to update last_sign_in:", error);
    });
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <AgenciesSidebar>
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your agency performance and metrics
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <KPICard
            title="Rented Assets"
            value={kpiData.rentedAssets}
            icon={Home}
            trend={{
              value: 12.5,
              label: "from last month",
              isPositive: true,
            }}
            iconBgColor="bg-green-500/10"
            iconColor="text-green-600 dark:text-green-400"
          />
          <KPICard
            title="Listed Assets"
            value={kpiData.listedAssets}
            icon={List}
            trend={{
              value: 5.2,
              label: "from last month",
              isPositive: true,
            }}
            iconBgColor="bg-blue-500/10"
            iconColor="text-blue-600 dark:text-blue-400"
          />
          <KPICard
            title="Collected Rent"
            value={formatCurrency(kpiData.collectedRent)}
            icon={Euro}
            trend={{
              value: 8.3,
              label: "from last month",
              isPositive: true,
            }}
            iconBgColor="bg-emerald-500/10"
            iconColor="text-emerald-600 dark:text-emerald-400"
          />
          <KPICard
            title="Due Rent"
            value={formatCurrency(kpiData.dueRent)}
            icon={AlertCircle}
            trend={{
              value: -14.3,
              label: "from last month",
              isPositive: true,
            }}
            iconBgColor="bg-yellow-500/10"
            iconColor="text-yellow-600 dark:text-yellow-400"
          />
          <KPICard
            title="Open Support Tickets"
            value={kpiData.openTickets}
            icon={Ticket}
            trend={{
              value: -20.0,
              label: "from last month",
              isPositive: true,
            }}
            iconBgColor="bg-red-500/10"
            iconColor="text-red-600 dark:text-red-400"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <RevenueChart data={revenueData} />
          <PropertiesChart data={propertiesData} />
        </div>

        <SupportTicketsChart data={supportTicketsData} />
      </div>
    </AgenciesSidebar>
  );
}

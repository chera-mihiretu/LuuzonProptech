'use client';
import { useEffect, useState } from 'react';
import { AdminSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Users, UserCheck, UserPlus, Activity, Home, CheckSquare } from 'lucide-react';
import { KPICard } from "@/components/agency/kpi-card";
import { PropertiesChart } from "@/components/agency/properties-chart";
import { ActiveUsersChart } from "@/components/admin/active-users-chart";
import { getAdminDashboardStats } from "@/app/api/admin/dashboard/stats";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ tenants: 0, managers: 0, staff: 0, activeUsers: 0, listedCount: 0, rentedCount: 0 });
  const [propsMonthly, setPropsMonthly] = useState<any[]>([]);
  const [activeDaily, setActiveDaily] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await getAdminDashboardStats();
      if (res && (res as any).success) {
        const data = (res as any).data || { counts: {}, charts: {} };
        setCounts(data.counts || { tenants: 0, managers: 0, staff: 0, activeUsers: 0, listedCount: 0, rentedCount: 0 });
        setPropsMonthly(data.charts?.propertiesMonthly || []);
        setActiveDaily(data.charts?.activeUsersDaily || []);
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
          {/* KPI Cards */}
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <KPICard title="Total Tenants" value={counts.tenants} icon={Users} />
              <KPICard title="Agency Managers" value={counts.managers} icon={UserCheck} />
              <KPICard title="Agency Staff" value={counts.staff} icon={UserPlus} />
              <KPICard title="Active (7 days)" value={counts.activeUsers} icon={Activity} />
              <KPICard title="Listed Properties" value={counts.listedCount} icon={Home} iconBgColor="bg-blue-500/10" iconColor="text-blue-600 dark:text-blue-400" />
              <KPICard title="Rented Properties" value={counts.rentedCount} icon={CheckSquare} iconBgColor="bg-green-500/10" iconColor="text-green-600 dark:text-green-400" />
            </div>
          )}

          {/* Charts */}
          {loading ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <Skeleton className="h-[340px] w-full" />
              <Skeleton className="h-[340px] w-full" />
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <PropertiesChart data={propsMonthly || []} />
              <ActiveUsersChart data={activeDaily || []} />
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

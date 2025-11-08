"use client"

import * as React from "react"
import {
  Activity,
  PieChart,
  Settings,
  Target,
  TrendingUp,
  UserCog,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/app/api/auth/get-user/get-current-user"
import { User } from "better-auth"
import MY_ROUTES from "@/data/routes"

// This is sample data.
const agentData = {
  navMain: [
    {
      title: "Agent",
      url: "#",
      icon: UserCog,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: MY_ROUTES.agencies.dashboard,
        },
        {
          title: "Applications",
          url: MY_ROUTES.agencies.applications,
        },
        {
          title: "My Properties",
          url: MY_ROUTES.agencies.myproperty,
        },
        {
          title: "My Teams",
          url: MY_ROUTES.agencies.teams
        }
      ],
    },
    
    
    
  ],
  projects: [
    {
      name: "Analytics",
      url: "#",
      icon: TrendingUp,
    },
    {
      name: "Sales",
      url: "#",
      icon: PieChart,
    },
  ],
}

export function AgentSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const [user, setUser] = useState<User|null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setUser(user);
      } else {
        router.push(MY_ROUTES.login);
      }
    };
    fetchUser();
  }, [router]);
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={agentData.navMain} />
        <NavProjects projects={agentData.projects} />
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser {...user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}


const tenantData = {
  navMain: [
    {
      title: "Agent",
      url: "#",
      icon: UserCog,
      isActive: true,
      items: [
        {
          title: "Home",
          url: MY_ROUTES.tenants.dashboard,
        },
        {
          title: "My Applications",
          url: "#",
        },
        {
          title: "My Dossier",
          url: MY_ROUTES.tenants.dossier,
        },
      ],
    },
    
    
    
  ],
  projects: [
    {
      name: "Relevant",
      url: "#",
      icon: Target,
    },
    {
      name: "Setting", 
      url: MY_ROUTES.tenants.settings, 
      icon: Settings
    }
  ],
}
export function TenantSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const [user, setUser] = useState<User|null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setUser(user);
      } else {
        router.push(MY_ROUTES.login);
      }
    };
    fetchUser();
  }, [router]);
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={tenantData.navMain} />
        <NavProjects projects={tenantData.projects} />
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser {...user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}


const adminData = {
  navMain: [
    {
      title: "Accounts",
      url: "#",
      icon: UserCog,
      isActive: true,
      items: [
        {
          title: "Agents",
          url: MY_ROUTES.admin.agents,
        },
        {
          title: "Tenants",
          url: MY_ROUTES.admin.tenants,
        },
      ],
      
    },
    {
      title: "Activities", 
      url: '#', 
      icon: Activity, 
      isActive: true, 
      items: [
        {
          title: "New Agencies",
          url: "#",
        },
        {
          title: "Property Posts",
          url: "#",
        },
        {
          title: "Applications",
          url: "#",
        },
        {
          title: "Complaints",
          url: "#",
        },
      ]
    }
    
    
    
  ],
  projects: [
    {
      name: "Setting", 
      url: MY_ROUTES.admin.settings, 
      icon: Settings
    }
  ],
}
export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const [user, setUser] = useState<User|null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setUser(user);
      } else {
        router.push(MY_ROUTES.login);
      }
    };
    fetchUser();
  }, [router]);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={adminData.navMain} />
        <NavProjects projects={adminData.projects} />
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser {...user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
"use client"

import * as React from "react"
import {
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
          title: "Home",
          url: "#",
        },
        {
          title: "Applications",
          url: "#",
        },
        {
          title: "My Properties",
          url: "#",
        },
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
        router.push('/login');
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
          url: "#",
        },
        {
          title: "My Applications",
          url: "#",
        },
        {
          title: "My Dossier",
          url: "#",
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
      url: "#", 
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
        router.push('/login');
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

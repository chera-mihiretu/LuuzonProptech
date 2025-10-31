"use client"

import * as React from "react"
import {
  AudioWaveform,
  BarChart,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  TrendingUp,
  UserCheck,
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
import { UserModel } from "@/data/models/user.model"
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/app/api/auth/get-user/get-current-user"
import { User } from "better-auth"
// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser {...user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

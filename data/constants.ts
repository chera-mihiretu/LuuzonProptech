import { Settings, Home } from "lucide-react";

export enum UserRoles  {
    ADMIN = "admin", 
    TENANT = "tenant", 
    AGENCY_MANAGER = "agency_manager", 
    AGENCY_STAFF = "agency_staff"
}


export const AgencySidebarItems = [
{
    title: "Home",
    url: "#",
    icon: Home,
},

{
    title: "Settings",
    url: "#",
    icon: Settings,
},]

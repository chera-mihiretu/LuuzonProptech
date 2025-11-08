import { forgetPassword } from "@/app/api/auth/reset-password/forget-password";
import { resetPassword } from "@/app/api/auth/reset-password/reset-password";
import { redirect } from "next/dist/server/api-utils";



const  MY_ROUTES = {
    home: '/',
    login: '/login',
    register: '/signup',
    verification: '/verification',
    completeProfile: '/complete-profile',
    redirect: '/redirecting',
    resetPassword: '/reset-password',
    forgetPassword: "/forget-password", 
    tenants : {
        current: '/tenant', 
        dashboard: '/tenant/dashboard',
        settings: '/tenant/settings',
        dossier: '/tenant/dossier',
        propertyDetail: (id: string) => `/tenant/properties/${id}`
    },

    agencies : {
        applications: '/agency/applications',
        current: '/agency',
        dashboard: '/agency/dashboard',
        teams: '/agency/teams',
        settings: '/agency/settings',
        myproperty: '/agency/myproperty',

        mypropertyRented: '/agency/myproperty/rented',
        propertyDetail: (id: string) => `/agency/myproperty/${id}`
    },
    admin: {
        current: '/admin', 
        dashboard: '/admin/dashboard',
        settings: '/admin/settings',
        agents: '/admin/agents',
        tenants: '/admin/tenants'
    }
};
 



export default MY_ROUTES;
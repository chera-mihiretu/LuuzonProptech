// middleware.ts  (project root)
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";               // your better-auth instance
import { client } from "@/db/db";                 // your MongoDB client
import { userCollection } from "@/db/collections";
import { UserModel } from "./data/models/user.model";
import { UserRoles } from "./data/constants";
import MY_ROUTES from "./data/routes";
import { role } from "better-auth/plugins";

export const runtime = "nodejs";   // <-- required for DB calls

const preSessionEndpoints = [
  MY_ROUTES.login,
  MY_ROUTES.register,
  MY_ROUTES.resetPassword,
  MY_ROUTES.forgetPassword,
  MY_ROUTES.home,
  MY_ROUTES.verification, 
]

const completedUserEndpoints = [
  MY_ROUTES.agencies.current,
  MY_ROUTES.tenants.current,
]

const nonCompletedUserEndpoints = [
  MY_ROUTES.completeProfile,
]


const redircetingEndpoints = [
  MY_ROUTES.redirect,
]


export async function middleware(request: NextRequest) {
  // 1. Validate the full session (cookie + DB)
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const { pathname } = request.nextUrl;

  // 2. Not logged in → go to login



  if (!session) {
    //! since user is not logged he can visit the presession endpoint only
    if (!preSessionEndpoints.some((p) => p === '/' ?  pathname === p : pathname.startsWith(p) )) {
     
      return NextResponse.redirect(new URL(MY_ROUTES.login, request.url));
    }
  } else {


    const userProfile : UserModel | null  = await userCollection.findOne<UserModel>({
    user_id: session?.user.id,
    });
    
    // If a document is missing → force profile completion
    if (!userProfile   ) {
      if (!pathname.startsWith(MY_ROUTES.completeProfile))
        return NextResponse.redirect(new URL(MY_ROUTES.completeProfile, request.url));
    } else if  (!completedUserEndpoints.some((p) => pathname.startsWith(p))) {
      if (userProfile?.role == UserRoles.AGENCY_MANAGER) {
        return NextResponse.redirect(new URL(MY_ROUTES.agencies.dashboard, request.url));
      } else if (userProfile?.role == UserRoles.AGENCY_STAFF) {
        return NextResponse.redirect(new URL(MY_ROUTES.agencies.dashboard, request.url));
      } else if (userProfile?.role == UserRoles.TENANT) {
        return NextResponse.redirect(new URL(MY_ROUTES.tenants.dashboard, request.url));
      }
    } 


    if (userProfile?.role == UserRoles.TENANT) {
      if (!pathname.startsWith(MY_ROUTES.tenants.current)) {
        return NextResponse.redirect(new URL(MY_ROUTES.tenants.dashboard, request.url));
      } 
    } 
    if (userProfile?.role == UserRoles.AGENCY_MANAGER || userProfile?.role == UserRoles.AGENCY_STAFF) {
      if (!pathname.startsWith(MY_ROUTES.agencies.current)) {
        return NextResponse.redirect(new URL(MY_ROUTES.agencies.dashboard, request.url));
      } 
    }
    if (userProfile?.role == UserRoles.ADMIN) {
      if (!pathname.startsWith(MY_ROUTES.admin.current)) {
        return NextResponse.redirect(new URL(MY_ROUTES.admin.dashboard, request.url));
      }
    }

  }
  // 5. Everything else → continue
  return NextResponse.next();
}

// Run only on the routes you need (adds zero overhead on static pages)
export const config = {
  matcher: [
    // MY_ROUTES.home, 
    '/agency/:path*',
    '/tenant/:path*', 
    '/redirecting',
    '/', 
    '/login', 
    '/signup',
    '/complete-profile', 
    '/reset-password', 
    '/forget-password', 
    '/verification', 
    '/complete-profile'
  ],
};
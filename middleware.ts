// middleware.ts  (project root)
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";               // your better-auth instance
import { client } from "@/db/db";                 // your MongoDB client
import { userCollection } from "@/db/collections";
import { UserModel } from "./data/models/user.model";
import { UserRoles } from "./data/constants";
import path from "path";

export const runtime = "nodejs";   // <-- required for DB calls

export async function middleware(request: NextRequest) {
  // 1. Validate the full session (cookie + DB)
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // 2. Not logged in → go to login
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const userProfile : UserModel | null  = await userCollection.findOne<UserModel>({
	userId: session.user.id,
  });

  const { pathname } = request.nextUrl;

  // 3. Public routes – skip any profile check
  const publicPaths = ["/login", "/signup", "/verification", '/home'];
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  
  
	// If a document is missing → force profile completion
	if (!userProfile) {
		return NextResponse.redirect(new URL("/complete-profile", request.url));
	}
	

  
	if (pathname.startsWith('/complete-profile')) {
		if (userProfile?.role == UserRoles.AGENCY_MANAGER) {
			return NextResponse.redirect(new URL('/agency/dashboard', request.url));
		} else if (userProfile?.role == UserRoles.AGENCY_STAFF) {
			return NextResponse.redirect(new URL('/agency/dashboard', request.url));
		} else if (userProfile?.role == UserRoles.TENANT) {
			return NextResponse.redirect(new URL('/tenant/dashboard', request.url));
		}
	}


  if (pathname.startsWith('/agency')) {
    if (userProfile?.role == UserRoles.TENANT) {
      return NextResponse.redirect(new URL('/tenant/dashboard', request.url));
    } 
  } 
  if (pathname.startsWith('/tenant')) {
    if (userProfile?.role == UserRoles.AGENCY_MANAGER || userProfile?.role == UserRoles.AGENCY_STAFF) {
      return NextResponse.redirect(new URL('/agency/dashboard', request.url));
    } 
  }

  // 5. Everything else → continue
  return NextResponse.next();
}

// Run only on the routes you need (adds zero overhead on static pages)
export const config = {
  matcher: [
    "/dashboard/:path*",   // all dashboard pages
    "/complete-profile",   
    "/tenant/:path*", 
    "/agency/:path*",
  ],
};
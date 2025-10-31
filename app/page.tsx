import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { logout } from "./api/auth/logout/logout";




export default async function Home() {
	
	return (
		<div>
			<h1>Home</h1>
		</div>
	)
}

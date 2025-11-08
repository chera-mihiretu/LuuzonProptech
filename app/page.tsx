import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center gap-8 p-6">
			<div className="text-center space-y-4">
				<h1 className="text-4xl font-bold">Smart Rental System</h1>
				<p className="text-muted-foreground text-lg">
					Streamline your property rental management
				</p>
			</div>
			<Button asChild size="lg">
				<Link href="/login">Login</Link>
			</Button>
		</div>
	)
}

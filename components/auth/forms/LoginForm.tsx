"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import Link from "next/link";

export default function LoginForm() {
	const [view, setView] = useState<"login" | "signup">("login");

	// login state
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// agency signup state
	const [agencyName, setAgencyName] = useState("");
	const [managerName, setManagerName] = useState("");
	const [agencyEmail, setAgencyEmail] = useState("");
	const [address, setAddress] = useState("");
	const [sirenSiret, setSirenSiret] = useState("");
	const [agencyPassword, setAgencyPassword] = useState("");

	// tenant signup state
	const [tenantName, setTenantName] = useState("");
	const [tenantEmail, setTenantEmail] = useState("");
	const [tenantPassword, setTenantPassword] = useState("");

	async function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password })
			});
			if (!res.ok) throw new Error("Invalid credentials");
			window.location.href = "/";
		} catch (err: any) {
			setError(err?.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	function handleGoogle() {
		window.location.href = "/api/auth/oauth/google";
	}

	async function handleAgencySignup(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: agencyEmail, password: agencyPassword, name: managerName })
			});
			if (!res.ok) throw new Error("Failed to register agency account");
			await fetch("/api/agency/otp/request", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ agencyEmail })
			});
			alert("Agency registered. OTP sent for verification.");
		} catch (err: any) {
			setError(err?.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	async function handleTenantSignup(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: tenantEmail, password: tenantPassword, name: tenantName })
			});
			if (!res.ok) throw new Error("Failed to register tenant");
			alert("Tenant registered. You can now log in.");
		} catch (err: any) {
			setError(err?.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>{view === "login" ? "Login" : "Create account"}</CardTitle>
			</CardHeader>
			<CardContent>
				{view === "login" ? (
					// Vertical layout: form then Google button
					<form onSubmit={handleLoginSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input id="password" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
						</div>
						{error && <p className="text-red-600 text-sm">{error}</p>}
						<div className="flex flex-col gap-2">
							<Button className="w-full" disabled={loading}>{loading ? "Logging in..." : "Login"}</Button>
							<Button className="w-full" type="button" variant="outline" onClick={handleGoogle}>
								<svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path fill="#4285F4" d="M23.49 12.27c0-.82-.07-1.42-.23-2.04H12.24v3.72h6.46c-.13.93-.83 2.33-2.38 3.28l-.02.13 3.46 2.68.24.02c2.19-2.02 3.49-5 3.49-7.99z"/>
									<path fill="#34A853" d="M12.24 24c3.17 0 5.83-1.05 7.77-2.87l-3.7-2.86c-.99.68-2.31 1.16-4.07 1.16-3.11 0-5.75-2.02-6.69-4.82l-.12.01-3.62 2.8-.05.11C2.72 21.54 7.11 24 12.24 24z"/>
									<path fill="#FBBC05" d="M5.55 14.61a7.35 7.35 0 0 1-.41-2.36c0-.82.15-1.62.4-2.36l-.01-.16L1.86 6.86l-.12.05A11.92 11.92 0 0 0 0 12.25c0 1.94.47 3.76 1.3 5.34l4.25-2.98z"/>
									<path fill="#EA4335" d="M12.24 4.75c2.2 0 3.68.95 4.53 1.75l3.3-3.23C18.05 1.17 15.41 0 12.24 0 7.11 0 2.72 2.46 1.3 6.91l4.24 2.98c.94-2.8 3.58-4.82 6.7-4.82z"/>
								</svg>
								Continue with Google
							</Button>
							<p className="text-sm text-zinc-600">
								Don't have an account?{" "}
								<Link href="#" className="underline" onClick={(e) => { e.preventDefault(); setView("signup"); }}>Sign up</Link>
							</p>
						</div>
					</form>
				) : (
					// SIGNUP VIEW: Tabs for Agency and Tenant
					<div className="space-y-4">
						<Tabs defaultValue="agency" className="w-full">
							<TabsList className="grid grid-cols-2 w-full">
								<TabsTrigger value="agency">Agency Signup</TabsTrigger>
								<TabsTrigger value="tenant">Tenant Signup</TabsTrigger>
							</TabsList>
							<TabsContent value="agency">
								<form onSubmit={handleAgencySignup} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="agencyName">Agency name</Label>
										<Input id="agencyName" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} required />
									</div>
									<div className="space-y-2">
										<Label htmlFor="managerName">Manager name</Label>
										<Input id="managerName" value={managerName} onChange={(e) => setManagerName(e.target.value)} required />
									</div>
									<div className="space-y-2">
										<Label htmlFor="agencyEmail">Agency email (login)</Label>
										<Input id="agencyEmail" type="email" value={agencyEmail} onChange={(e) => setAgencyEmail(e.target.value)} required />
									</div>
									<div className="space-y-2">
										<Label htmlFor="address">Address (France)</Label>
										<Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
									</div>
									<div className="space-y-2">
										<Label htmlFor="sirenSiret">SIREN / SIRET</Label>
										<Input id="sirenSiret" value={sirenSiret} onChange={(e) => setSirenSiret(e.target.value)} required />
									</div>
									<div className="space-y-2">
										<Label htmlFor="agencyPassword">Password</Label>
										<Input id="agencyPassword" type="password" value={agencyPassword} onChange={(e) => setAgencyPassword(e.target.value)} required />
									</div>
								{error && <p className="text-red-600 text-sm">{error}</p>}
								<div className="flex flex-col gap-2">
									<Button className="w-full" disabled={loading}>{loading ? "Creating..." : "Create agency"}</Button>
									<Button className="w-full" type="button" variant="outline" onClick={handleGoogle}>
										<svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
											<path fill="#4285F4" d="M23.49 12.27c0-.82-.07-1.42-.23-2.04H12.24v3.72h6.46c-.13.93-.83 2.33-2.38 3.28l-.02.13 3.46 2.68.24.02c2.19-2.02 3.49-5 3.49-7.99z"/>
											<path fill="#34A853" d="M12.24 24c3.17 0 5.83-1.05 7.77-2.87l-3.7-2.86c-.99.68-2.31 1.16-4.07 1.16-3.11 0-5.75-2.02-6.69-4.82l-.12.01-3.62 2.8-.05.11C2.72 21.54 7.11 24 12.24 24z"/>
											<path fill="#FBBC05" d="M5.55 14.61a7.35 7.35 0 0 1-.41-2.36c0-.82.15-1.62.4-2.36l-.01-.16L1.86 6.86l-.12.05A11.92 11.92 0 0 0 0 12.25c0 1.94.47 3.76 1.3 5.34l4.25-2.98z"/>
											<path fill="#EA4335" d="M12.24 4.75c2.2 0 3.68.95 4.53 1.75l3.3-3.23C18.05 1.17 15.41 0 12.24 0 7.11 0 2.72 2.46 1.3 6.91l4.24 2.98c.94-2.8 3.58-4.82 6.7-4.82z"/>
										</svg>
										Continue with Google
									</Button>
									<Button className="w-full" type="button" variant="ghost" onClick={() => setView("login")}>Back to login</Button>
								</div>
								</form>
							</TabsContent>
							<TabsContent value="tenant">
								<form onSubmit={handleTenantSignup} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="tenantName">Tenant name</Label>
										<Input id="tenantName" value={tenantName} onChange={(e) => setTenantName(e.target.value)} required />
									</div>
									<div className="space-y-2">
										<Label htmlFor="tenantEmail">Tenant email</Label>
										<Input id="tenantEmail" type="email" value={tenantEmail} onChange={(e) => setTenantEmail(e.target.value)} required />
									</div>
									<div className="space-y-2">
										<Label htmlFor="tenantPassword">Password</Label>
										<Input id="tenantPassword" type="password" value={tenantPassword} onChange={(e) => setTenantPassword(e.target.value)} required />
									</div>
								{error && <p className="text-red-600 text-sm">{error}</p>}
								<div className="flex flex-col gap-2">
									<Button className="w-full" disabled={loading}>{loading ? "Creating..." : "Create tenant"}</Button>
									<Button className="w-full" type="button" variant="outline" onClick={handleGoogle}>
										<svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
											<path fill="#4285F4" d="M23.49 12.27c0-.82-.07-1.42-.23-2.04H12.24v3.72h6.46c-.13.93-.83 2.33-2.38 3.28l-.02.13 3.46 2.68.24.02c2.19-2.02 3.49-5 3.49-7.99z"/>
											<path fill="#34A853" d="M12.24 24c3.17 0 5.83-1.05 7.77-2.87l-3.7-2.86c-.99.68-2.31 1.16-4.07 1.16-3.11 0-5.75-2.02-6.69-4.82l-.12.01-3.62 2.8-.05.11C2.72 21.54 7.11 24 12.24 24z"/>
											<path fill="#FBBC05" d="M5.55 14.61a7.35 7.35 0 0 1-.41-2.36c0-.82.15-1.62.4-2.36l-.01-.16L1.86 6.86l-.12.05A11.92 11.92 0 0 0 0 12.25c0 1.94.47 3.76 1.3 5.34l4.25-2.98z"/>
											<path fill="#EA4335" d="M12.24 4.75c2.2 0 3.68.95 4.53 1.75l3.3-3.23C18.05 1.17 15.41 0 12.24 0 7.11 0 2.72 2.46 1.3 6.91l4.24 2.98c.94-2.8 3.58-4.82 6.7-4.82z"/>
										</svg>
										Continue with Google
									</Button>
									<Button className="w-full" type="button" variant="ghost" onClick={() => setView("login")}>Back to login</Button>
								</div>
								</form>
							</TabsContent>
						</Tabs>
					</div>
				)}
			</CardContent>
		</Card>
	);
}



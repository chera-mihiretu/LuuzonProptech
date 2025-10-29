"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

type Role = "tenant" | "agency";

export default function RegisterForm() {
	const [role, setRole] = useState<Role>("tenant");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	// tenant
	const [tenantName, setTenantName] = useState("");
	const [tenantEmail, setTenantEmail] = useState("");
	const [tenantPassword, setTenantPassword] = useState("");

	// agency
	const [agencyName, setAgencyName] = useState("");
	const [managerName, setManagerName] = useState("");
	const [agencyEmail, setAgencyEmail] = useState("");
	const [address, setAddress] = useState("");
	const [sirenSiret, setSirenSiret] = useState("");
	const [agencyPassword, setAgencyPassword] = useState("");

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setSuccess(null);
		setLoading(true);
		try {
			if (role === "tenant") {
				const res = await fetch("/api/auth/register", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email: tenantEmail, password: tenantPassword, name: tenantName })
				});
				if (!res.ok) throw new Error("Failed to register tenant");
				setSuccess("Tenant registered. You can now log in.");
			} else {
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
				setSuccess("Agency registered. OTP sent for verification.");
			}
		} catch (err: any) {
			setError(err?.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Create account</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex gap-2 mb-4">
					<Button type="button" variant={role === "tenant" ? "default" : "outline"} onClick={() => setRole("tenant")}>Tenant</Button>
					<Button type="button" variant={role === "agency" ? "default" : "outline"} onClick={() => setRole("agency")}>Agency</Button>
				</div>
				<form onSubmit={handleSubmit} className="space-y-4">
					{role === "tenant" ? (
						<>
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
						</>
					) : (
						<>
							<div className="space-y-2">
								<Label htmlFor="agencyName">Agency name</Label>
								<Input id="agencyName" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} required />
							</div>
							<div className="space-y-2">
								<Label htmlFor="managerName">Manager name</Label>
								<Input id="managerName" value={managerName} onChange={(e) => setManagerName(e.target.value)} required />
							</div>
							<div className="space-y-2">
								<Label htmlFor="agencyEmail">Agency email</Label>
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
							<p className="text-sm opacity-70">After registration, check your email/SMS and complete OTP verification.</p>
						</>
					)}

					{error && <p className="text-red-600 text-sm">{error}</p>}
					{success && <p className="text-green-600 text-sm">{success}</p>}
					<Button disabled={loading}>{loading ? "Submitting..." : "Register"}</Button>
				</form>
			</CardContent>
		</Card>
	);
}



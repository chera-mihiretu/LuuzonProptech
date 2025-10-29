"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

export function AgencyOtpRequestForm() {
	const [agencyEmail, setAgencyEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setMessage(null);
		try {
			const res = await fetch("/api/agency/otp/request", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ agencyEmail })
			});
			if (!res.ok) throw new Error("Failed to request OTP");
			setMessage("OTP sent if agency exists.");
		} catch (e: any) {
			setMessage(e?.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Request OTP</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-3">
					<div className="space-y-2">
						<Label htmlFor="agencyEmailReq">Agency email</Label>
						<Input id="agencyEmailReq" type="email" value={agencyEmail} onChange={(e) => setAgencyEmail(e.target.value)} required />
					</div>
					<Button disabled={loading}>{loading ? "Sending..." : "Send OTP"}</Button>
					{message && <p className="text-sm opacity-80">{message}</p>}
				</form>
			</CardContent>
		</Card>
	);
}

export function AgencyOtpVerifyForm() {
	const [agencyEmail, setAgencyEmail] = useState("");
	const [code, setCode] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setMessage(null);
		try {
			const res = await fetch("/api/agency/otp/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ agencyEmail, code })
			});
			if (!res.ok) throw new Error("Invalid or expired OTP");
			setMessage("Agency verified successfully.");
		} catch (e: any) {
			setMessage(e?.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Verify OTP</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-3">
					<div className="space-y-2">
						<Label htmlFor="agencyEmailVer">Agency email</Label>
						<Input id="agencyEmailVer" type="email" value={agencyEmail} onChange={(e) => setAgencyEmail(e.target.value)} required />
					</div>
					<div className="space-y-2">
						<Label htmlFor="otp">OTP code</Label>
						<Input id="otp" value={code} onChange={(e) => setCode(e.target.value)} required />
					</div>
					<Button disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</Button>
					{message && <p className="text-sm opacity-80">{message}</p>}
				</form>
			</CardContent>
		</Card>
	);
}



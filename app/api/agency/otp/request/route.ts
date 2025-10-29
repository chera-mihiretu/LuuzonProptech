import { NextRequest, NextResponse } from "next/server";
import { connectMongoose } from "../../../../../db/mongoose";
import { Agency } from "../../../../../models/Agency";

function generateOtp(length = 6): string {
	const digits = "0123456789";
	let code = "";
	for (let i = 0; i < length; i++) code += digits[Math.floor(Math.random() * digits.length)];
	return code;
}

export async function POST(req: NextRequest) {
	const body = await req.json();
	const agencyEmail: string | undefined = body?.agencyEmail;
	if (!agencyEmail) {
		return NextResponse.json({ error: "agencyEmail is required" }, { status: 400 });
	}

	await connectMongoose();
	const agency = await Agency.findOne({ agencyEmail });
	if (!agency) {
		return NextResponse.json({ error: "Agency not found" }, { status: 404 });
	}

	const code = generateOtp();
	const expires = new Date(Date.now() + 10 * 60 * 1000);
	agency.otpCode = code;
	agency.otpExpiresAt = expires;
	agency.otpVerified = false;
	await agency.save();

	// Integrate an email/SMS service here to deliver the OTP.
	// For now we return masked confirmation for development only.
	return NextResponse.json({ ok: true, expiresAt: expires.toISOString() });
}



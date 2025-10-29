import { NextRequest, NextResponse } from "next/server";
import { connectMongoose } from "../../../../../db/mongoose";
import { Agency } from "../../../../../models/Agency";

export async function POST(req: NextRequest) {
	const body = await req.json();
	const agencyEmail: string | undefined = body?.agencyEmail;
	const code: string | undefined = body?.code;
	if (!agencyEmail || !code) {
		return NextResponse.json({ error: "agencyEmail and code are required" }, { status: 400 });
	}

	await connectMongoose();
	const agency = await Agency.findOne({ agencyEmail });
	if (!agency || !agency.otpCode || !agency.otpExpiresAt) {
		return NextResponse.json({ error: "OTP not requested" }, { status: 400 });
	}

	if (agency.otpExpiresAt.getTime() < Date.now()) {
		return NextResponse.json({ error: "OTP expired" }, { status: 400 });
	}

	if (agency.otpCode !== code) {
		return NextResponse.json({ error: "Invalid code" }, { status: 400 });
	}

	agency.otpVerified = true;
	agency.otpCode = null as any;
	agency.otpExpiresAt = null as any;
	await agency.save();

	return NextResponse.json({ ok: true });
}



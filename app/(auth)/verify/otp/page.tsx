import { AgencyOtpRequestForm, AgencyOtpVerifyForm } from "../../../../components/auth/forms/AgencyOtpForms";

export default function Page() {
	return (
		<div className="max-w-lg mx-auto p-6 space-y-6">
			<h1 className="text-2xl">Agency OTP Verification</h1>
			<div>
				<h2 className="text-lg mb-2">Request code</h2>
				<AgencyOtpRequestForm />
			</div>
			<div>
				<h2 className="text-lg mb-2">Verify code</h2>
				<AgencyOtpVerifyForm />
			</div>
		</div>
	);
}



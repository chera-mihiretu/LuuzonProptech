import RegisterForm from "../../../components/auth/forms/RegisterForm";

export default function Page() {
	return (
		<div className="max-w-lg mx-auto p-6">
			<h1 className="text-2xl mb-4">Create account</h1>
			<RegisterForm />
		</div>
	);
}



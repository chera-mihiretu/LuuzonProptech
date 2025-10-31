'use client';
export default function Redirecting() {
	return (
		<div className="min-h-svh flex items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<div className="h-10 w-10 rounded-full border-2 border-muted-foreground/30 border-t-primary animate-spin" />
				<p className="text-sm text-muted-foreground">Redirecting…</p>
			</div>
		</div>
	)
}
import { createFileRoute } from '@tanstack/react-router';
import { GalleryVerticalEnd } from 'lucide-react';
import { LoginForm } from '@/components/login-form';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/utils/client-side';

export const Route = createFileRoute('/login')({
	component: RouteComponent,
});

function RouteComponent() {
	const trpc = useTRPC();
	const healthCheck = useQuery(trpc.router.healthCheck.queryOptions());

	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<a href="#" className="flex items-center gap-2 self-center font-medium">
					<div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
						<GalleryVerticalEnd className="size-4" />
					</div>
					Acme Inc.
				</a>
				<div className="flex items-center gap-2">
					<div
						className={`h-2 w-2 rounded-full ${healthCheck.data ? 'bg-green-500' : 'bg-red-500'}`}
					/>
					<span className="text-muted-foreground text-sm">
						{healthCheck.isLoading
							? 'Checking...'
							: healthCheck.data
								? 'Connected'
								: 'Disconnected'}
					</span>
				</div>
				<LoginForm />
			</div>
		</div>
	);
}

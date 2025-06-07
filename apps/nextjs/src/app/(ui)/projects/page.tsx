'use client';
import { SiteHeader } from '@/components/site-header';
import { authClient } from '@/lib/auth-client';
import { useTRPC } from '@/trpc/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
	const { data: session, isPending } = authClient.useSession();
	const trpc = useTRPC();
	const router = useRouter();
	const privateData = useQuery(trpc.router.privateData.queryOptions());

	useEffect(() => {
		if (!session && !isPending) {
			router.push('/login');
		}
	}, [session, isPending]);

	if (isPending) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<SiteHeader breadcrumbs={[{ title: 'Projects', url: '/project' }]} />
			<div className="flex flex-1 flex-col">
				<div className="@container/main flex flex-1 flex-col gap-2">
					<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
						<h1>Dashboard</h1>
						<p>Welcome {session?.user.name}</p>
						<p>privateData: {privateData.data?.message}</p>
					</div>
				</div>
			</div>
		</>
	);
}

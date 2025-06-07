import Loader from '@/components/loader';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { Outlet, createRootRouteWithContext, useRouterState } from '@tanstack/react-router';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import '../index.css';

import { authClient } from '@/lib/auth-client';
import { useEffect } from 'react';

export interface RouterAppContext {

}

export const Route = createRootRouteWithContext<RouterAppContext>()({
	component: RootComponent,
	head: () => ({
		meta: [
			{
				title: 'My App',
			},
			{
				name: 'description',
				content: 'My App is a web application',
			},
		],
		links: [
			{
				rel: 'icon',
				href: '/favicon.ico',
			},
		],
	}),
});

function RootComponent() {
	const { data: session, isPending , error} = authClient.useSession();
	console.log(error);
	const navigate = Route.useNavigate();
	const isFetching = useRouterState({
		select: (s) => s.isLoading,
	});

	useEffect(() => {
		const currentPath = window.location.pathname;
		if (!session && !isPending) {
			navigate({
				to: '/login',
			});
		} else if (session && !isPending && currentPath === '/') {
			navigate({
				to: '/dashboard',
			});
		} else if (session && !isPending && currentPath === '/login') {
			navigate({
				to: '/dashboard',
			});
		}
	}, [session, isPending]);

	return (
		<>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				{isFetching || isPending ? <Loader /> : <Outlet />}
				<Toaster richColors />
			</ThemeProvider>
			{/* <TanStackRouterDevtools position="bottom-left" />
			<ReactQueryDevtools position="bottom" buttonPosition="bottom-right" /> */}
		</>
	);
}

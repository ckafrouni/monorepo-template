import { redirect } from 'next/navigation';
import { auth } from '@worspace/auth';
import { headers } from 'next/headers';

export const WithAuthProvider = (Component: React.ComponentType) => {
	return async (props: any) => {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			redirect('/login');
		}

		return <Component {...props} />;
	};
};

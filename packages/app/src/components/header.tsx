import { Link, useLocation } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';

import { Button } from './ui/button';
import { ModeToggle } from './mode-toggle';
import UserMenu from './user-menu';

function OpenInDesktopButton() {
	const location = useLocation();
	const [isWebApp, setIsWebApp] = useState(false);

	useEffect(() => {
		setIsWebApp(!(window as any).isTauri);
	}, []);

	const handleOpenInDesktop = () => {
		const deepLinkUrl = `zentio://${location.pathname}`;
		window.open(deepLinkUrl, '_self');
	};

	if (!isWebApp) {
		return null;
	}

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={handleOpenInDesktop}
			className="flex items-center gap-2"
		>
			<ExternalLink className="h-4 w-4" />
			Open in Desktop
		</Button>
	);
}

export default function Header() {
	const links = [
		{ to: '/', label: 'Home' },
		{ to: '/dashboard', label: 'Dashboard' },
		{ to: '/todos', label: 'Todos' },
		{ to: '/ai', label: 'AI Chat' },
	];

	return (
		<div>
			<div className="flex flex-row items-center justify-between px-2 py-1">
				<nav className="flex gap-4 text-lg">
					{links.map(({ to, label }) => {
						return (
							<Link key={to} to={to}>
								{label}
							</Link>
						);
					})}
				</nav>
				<div className="flex items-center gap-2">
					<OpenInDesktopButton />
					<ModeToggle />
					<UserMenu />
				</div>
			</div>
			<hr />
		</div>
	);
}

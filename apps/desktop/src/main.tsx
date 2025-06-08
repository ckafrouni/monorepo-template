// Desktop App Entry Point
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@worspace/app';
import '@worspace/app/src/index.css';
import { env } from './env';

// Tauri-specific setup
async function initTauri() {
	try {
		// Dynamic import of Tauri APIs for graceful fallback
		const { invoke } = await import('@tauri-apps/api/core');

		// Example: Get app version
		const appVersion = await invoke('get_app_version').catch(() => 'unknown');
		console.log('Tauri app version:', appVersion);
	} catch (error) {
		console.warn('Failed to initialize Tauri APIs:', error);
	}
}

// Desktop-specific setup and error handling
const isDev = env.NODE_ENV === 'development';

if (isDev) {
	console.log('🖥️ Desktop app running in development mode');
}

// Error boundary for desktop app
window.addEventListener('error', (event) => {
	console.error('Desktop app error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
	console.error('Unhandled promise rejection:', event.reason);

	// Could send to Tauri's logging system if available
	import('@tauri-apps/api/core')
		.then(({ invoke }) => {
			invoke('log_error', { error: String(event.reason) }).catch(() => {
				// Silent fallback
			});
		})
		.catch(() => {
			// Silent fallback if Tauri not available
		});
});

const rootElement = document.getElementById('app');

if (!rootElement) {
	throw new Error('Root element not found');
}

// Initialize Tauri and then render the app
initTauri().then(() => {
	if (!rootElement.innerHTML) {
		const root = ReactDOM.createRoot(rootElement);
		root.render(
			<React.StrictMode>
				<App platform="desktop" />
			</React.StrictMode>
		);
	}
});

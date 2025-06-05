// Desktop App Entry Point
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@zentio/app';
import '@zentio/app/src/index.css';

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

// Desktop-specific error handling
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

// Desktop-specific performance monitoring
const isDev = process.env.NODE_ENV === 'development';
if (isDev) {
	console.log('Desktop app running in development mode');
}

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

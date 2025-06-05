// Web App Entry Point
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@zentio/app';
import '@zentio/app/src/index.css';

// Web-specific setup and error handling
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

if (isDev) {
	// Web dev tools setup can go here
	console.log('Web app running in development mode');
}

// Web-specific error handling
window.addEventListener('unhandledrejection', (event) => {
	console.error('Unhandled promise rejection:', event.reason);
});

// Web-specific performance monitoring
if (isProd) {
	// Production web analytics could go here
}

const rootElement = document.getElementById('app');

if (!rootElement) {
	throw new Error('Root element not found');
}

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<App platform="web" />
		</React.StrictMode>
	);
}

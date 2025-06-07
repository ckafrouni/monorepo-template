import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	headers: async () => [
		{
			source: '/api/auth/:path*',
			headers: [
				{ key: 'Access-Control-Allow-Origin', value: 'http://localhost:3001' },
				{ key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
				{ key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-Requested-With, Accept' },
				{ key: 'Access-Control-Allow-Credentials', value: 'true' },
			],
		},
	],
};

export default nextConfig;

import { createFileRoute } from '@tanstack/react-router';

import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { DataTable } from '@/components/data-table';
import { SectionCards } from '@/components/section-cards';
import { SiteHeader } from '@/components/site-header';

import data from './-data/data.json';

export const Route = createFileRoute('/_app/analytics/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<SiteHeader breadcrumbs={[{ title: 'Analytics', url: '/analytics' }]} />
			<div className="flex flex-1 flex-col overflow-auto overscroll-contain">
				<div className="@container/main flex flex-1 flex-col gap-2">
					<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
						<SectionCards />
						<div className="px-4 lg:px-6">
							<ChartAreaInteractive />
						</div>
						<DataTable data={data} />
					</div>
				</div>
			</div>
		</>
	);
}

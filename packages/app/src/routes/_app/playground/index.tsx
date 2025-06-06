import { createFileRoute } from '@tanstack/react-router';
import { useChat } from '@ai-sdk/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { SiteHeader } from '@/components/site-header';

export const Route = createFileRoute('/_app/playground/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { messages, input, handleInputChange, handleSubmit } = useChat({
		api: `${import.meta.env.VITE_SERVER_URL}/ai`,
	});

	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	return (
		<>
			<SiteHeader breadcrumbs={[{ title: 'Playground', url: '/playground' }]} />

			<div className="relative mb-16 flex flex-1 flex-col overflow-auto overscroll-contain px-4">
				<div className="@container/main flex flex-1 flex-col gap-2">
					<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
						<div className="mx-auto grid w-full grid-rows-[1fr_auto]">
							<div className="space-y-4 overflow-y-auto pb-4">
								{messages.length === 0 ? (
									<div className="text-muted-foreground mt-8 text-center">
										Ask me anything to get started!
									</div>
								) : (
									messages.map((message) => (
										<div
											key={message.id}
											className={`rounded-lg p-3 ${
												message.role === 'user' ? 'bg-primary/10 ml-8' : 'bg-secondary/20 mr-8'
											}`}
										>
											<p className="mb-1 text-sm font-semibold">
												{message.role === 'user' ? 'You' : 'AI Assistant'}
											</p>
											<div className="whitespace-pre-wrap">{message.content}</div>
										</div>
									))
								)}
								<div ref={messagesEndRef} />
							</div>
						</div>
					</div>
				</div>
			</div>

			<form
				onSubmit={handleSubmit}
				className="bg-sidebar absolute bottom-0 flex w-full items-center space-x-2 border-t px-4 py-2"
			>
				<Input
					name="prompt"
					value={input}
					onChange={handleInputChange}
					placeholder="Type your message..."
					className="bg-background flex-1"
					autoComplete="off"
					autoFocus
				/>
				<Button type="submit" size="icon">
					<Send size={18} />
				</Button>
			</form>
		</>
	);
}

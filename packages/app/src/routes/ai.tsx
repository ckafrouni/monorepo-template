import { createFileRoute } from '@tanstack/react-router';
import { useChat } from '@ai-sdk/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useRef, useEffect } from 'react';

export const Route = createFileRoute('/ai')({
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
		<div className="mx-auto grid w-full grid-rows-[1fr_auto] overflow-hidden p-4">
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

			<form onSubmit={handleSubmit} className="flex w-full items-center space-x-2 border-t pt-2">
				<Input
					name="prompt"
					value={input}
					onChange={handleInputChange}
					placeholder="Type your message..."
					className="flex-1"
					autoComplete="off"
					autoFocus
				/>
				<Button type="submit" size="icon">
					<Send size={18} />
				</Button>
			</form>
		</div>
	);
}

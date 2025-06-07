import z from 'zod/v4';
import { publicProcedure } from '../trpc';
import { todo, db } from '@worspace/db';
import { eq } from 'drizzle-orm';
import type { TRPCRouterRecord } from "@trpc/server";

export const todoRouter = {
	getAll: publicProcedure.query(async () => {
		return await db.select().from(todo);
	}),

	create: publicProcedure
		.input(z.object({ text: z.string().min(1) }))
		.mutation(async ({ input }) => {
			return await db.insert(todo).values({
				text: input.text,
			});
		}),

	toggle: publicProcedure
		.input(z.object({ id: z.number(), completed: z.boolean() }))
		.mutation(async ({ input }) => {
			return await db.update(todo).set({ completed: input.completed }).where(eq(todo.id, input.id));
		}),

	delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
		return await db.delete(todo).where(eq(todo.id, input.id));
	}),
} satisfies TRPCRouterRecord;

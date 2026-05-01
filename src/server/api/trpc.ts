/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

import { env } from "~/env.mjs";
import { db } from "~/server/db";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 */

interface CreateContextOptions {
	userId: string | null;
}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
	return {
		userId: opts.userId,
		db,
	};
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
	const { req } = opts;

	// Check for JWT in Authorization header
	let userId: string | null = null;
	const authHeader = req.headers.authorization;
	if (authHeader?.startsWith("Bearer ")) {
		try {
			const token = authHeader.slice(7);
			const decoded = jwt.verify(token, env.JWT_SECRET) as { playthroughs?: string[] };
			// JWT contains playthrough IDs, not a user ID, so we pass null
			// The playthrough ownership is checked via the JWT in each procedure
		} catch {
			// Invalid token, continue as guest
		}
	}

	return createInnerTRPCContext({
		userId,
	});
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		};
	},
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 */
export const publicProcedure = t.procedure;

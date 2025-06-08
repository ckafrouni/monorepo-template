import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { env as baseEnv } from "@worspace/env";

export const env = createEnv({
  extends: [baseEnv],
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  server: {
    // Next.js specific server vars
    VERCEL_URL: z.string().optional(),
    PORT: z.coerce.number().default(3000),
  },
  client: {
    // Next.js specific client vars (prefixed with NEXT_PUBLIC_)
    // NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  },
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    // Add client vars here when needed
    // NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
}); 
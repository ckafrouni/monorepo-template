import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export function authEnv() {
  return createEnv({
    server: {
      BETTER_AUTH_SECRET: z.string().min(1),
      BETTER_AUTH_URL: z.string().url(),
      CORS_ORIGIN: z.string().min(1),
      NODE_ENV: z.enum(["development", "production", "test"]).optional(),
    },
    experimental__runtimeEnv: {},
    skipValidation:
      !!process.env.CI || process.env.npm_lifecycle_event === "lint",
  });
} 
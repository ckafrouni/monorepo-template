import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { authEnv } from "@worspace/auth/env";

export const env = createEnv({
  extends: [authEnv()],
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  server: {
    // Database
    DATABASE_URL: z.string().url(),
    POSTGRES_USER: z.string().min(1),
    POSTGRES_PASSWORD: z.string().min(1),
    POSTGRES_DB: z.string().min(1),
    POSTGRES_PORT: z.coerce.number().default(5432),
    
    // CORS
    CORS_ORIGIN: z.string().min(1),
    
    // Server
    PORT: z.coerce.number().default(8080),
    
    // External APIs
    OPENAI_API_KEY: z.string().optional(),
  },
  client: {
    // Client-side variables (none for now, but keeping structure)
  },
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
}); 
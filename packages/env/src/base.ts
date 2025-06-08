import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { authEnv } from "@worspace/auth/env";

export const baseEnv = createEnv({
  extends: [authEnv()],
  server: {
    // Database
    DATABASE_URL: z.string().url(),
    POSTGRES_USER: z.string().min(1),
    POSTGRES_PASSWORD: z.string().min(1),
    POSTGRES_DB: z.string().min(1),
    POSTGRES_PORT: z.coerce.number().default(5432),
    
    // Server
    PORT: z.coerce.number().default(8080),
    
    // External APIs
    OPENAI_API_KEY: z.string().optional(),
  },
  client: {
    // Client-side variables
    VITE_SERVER_URL: z.string().url(),
  },
  clientPrefix: "VITE_",
  runtimeEnv: {
    // Server vars
    DATABASE_URL: process.env.DATABASE_URL,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    PORT: process.env.PORT,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    
    // Client vars (populated by the environment at runtime)
    VITE_SERVER_URL: process.env.VITE_SERVER_URL,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
}); 
import { z } from "zod";

// Environment validation schema for Vite apps
export const viteEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  VITE_SERVER_URL: z.string().url(),
});

// Function to validate Vite environment variables at runtime
export function validateViteEnv(importMetaEnv: any) {
  const env = {
    NODE_ENV: importMetaEnv.NODE_ENV || "development",
    VITE_SERVER_URL: importMetaEnv.VITE_SERVER_URL,
  };

  try {
    return viteEnvSchema.parse(env);
  } catch (error) {
    console.error("❌ Invalid environment variables:", error);
    throw new Error("Invalid environment variables");
  }
}

export type ViteEnv = z.infer<typeof viteEnvSchema>; 
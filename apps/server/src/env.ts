import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { baseEnv } from "@worspace/env/base";

export const env = createEnv({
  extends: [baseEnv],
  server: {
    // Server-specific environment variables (if any)
    // All main vars are in baseEnv
  },
  client: {},
  clientPrefix: "VITE_",
  runtimeEnv: {
    // All runtime env vars are handled by baseEnv
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
}); 
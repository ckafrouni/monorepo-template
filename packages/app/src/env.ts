import { createEnv } from "@t3-oss/env-core";
import { baseEnv } from "@worspace/env/base";

export const env = createEnv({
  extends: [baseEnv],
  server: {
    // App package specific server vars (if any)
  },
  client: {
    // All client vars are in baseEnv
  },
  clientPrefix: "VITE_",
  runtimeEnv: {
    // For Vite, we need to populate client vars at runtime
    VITE_SERVER_URL: import.meta.env.VITE_SERVER_URL,
  },
  skipValidation:
    !!import.meta.env.CI || import.meta.env.npm_lifecycle_event === "lint",
}); 
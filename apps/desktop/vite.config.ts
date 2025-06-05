import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    TanStackRouterVite({
      routesDirectory: path.resolve(__dirname, "../../packages/app/src/routes"),
      generatedRouteTree: path.resolve(
        __dirname,
        "../../packages/app/src/routeTree.gen.ts"
      ),
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../../packages/app/src"),
    },
  },
  server: {
    port: 3002,
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});

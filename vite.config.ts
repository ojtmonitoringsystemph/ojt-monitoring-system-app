import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

function devtoolsJsonHandler() {
  return {
    name: "devtools-json-handler",
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url?.startsWith("/.well-known/")) {
          res.setHeader("Content-Type", "application/json");
          res.end("{}");
          return;
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    tailwindcss(),
    devtoolsJsonHandler(),
  ],
});

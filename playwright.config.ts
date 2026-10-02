import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  workers: 2,
  use: { ...devices["Desktop Chrome"], baseURL: "http://127.0.0.1:5215" },
  webServer: {
    // Serves the production build. Run `pnpm build` first — `next start`
    // fails with a confusing error if no build output exists.
    command:
      "pnpm build && pnpm run start -- --hostname 127.0.0.1 --port 5215",
    url: "http://127.0.0.1:5215",
    reuseExistingServer: false,
  },
});

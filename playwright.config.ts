import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  workers: 2,
  use: { ...devices["Desktop Chrome"], baseURL: "http://127.0.0.1:5215" },
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 5215",
    url: "http://127.0.0.1:5215",
    reuseExistingServer: false,
  },
});

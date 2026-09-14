import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  workers: 2,
  use: { ...devices["Desktop Chrome"], baseURL: "http://127.0.0.1:5205" },
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 5205",
    url: "http://127.0.0.1:5205",
    reuseExistingServer: false,
  },
});

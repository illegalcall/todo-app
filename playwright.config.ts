import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  workers: 2,
  use: { ...devices["Desktop Chrome"], baseURL: "http://127.0.0.1:5220" },
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 5220",
    url: "http://127.0.0.1:5220",
    reuseExistingServer: false,
  },
});

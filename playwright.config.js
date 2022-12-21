// @ts-check

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:5173/',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI
  },
  projects: [
    {
      name: 'All',
      testMatch: /.*e2e.spec.js/,
      retries: 0
    }
  ],
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    viewport: { width: 500, height: 720 },
    ignoreHTTPSErrors: true
  }
}

export default config

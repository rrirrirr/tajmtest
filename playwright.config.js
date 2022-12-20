// @ts-check

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  use: {
    headless: true,
    viewport: { width: 500, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'on-first-retry'
  }
}

export default config

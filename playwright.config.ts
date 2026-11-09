import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e', workers: 1, timeout: 60000,
  use: { baseURL: 'http://localhost:3001', headless: true, trace: 'retain-on-failure' },
  webServer: [
    { command: 'npm run start:prod --prefix ../rivalscope-backend', url: 'http://127.0.0.1:4000/api/health', reuseExistingServer: false, timeout: 60000, env: { NODE_ENV: 'test', SMTP_URL: 'smtp://127.0.0.1:1025' } },
    { command: 'npm run start -- --port 3001', url: 'http://localhost:3001', reuseExistingServer: false, timeout: 60000 },
  ],
});

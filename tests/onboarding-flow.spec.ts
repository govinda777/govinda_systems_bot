import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow', () => {
  test('should allow a new user to complete the onboarding process', async ({ page }) => {
    // Step 1: Visit the tenant's landing page.
    await page.goto('http://cliente1.localhost:3000');

    // Step 2: Find and click the "Start" link to go to the onboarding page.
    const startButton = page.getByRole('link', { name: 'Começar' });
    await startButton.click();

    // We expect the URL to change to the onboarding page.
    await expect(page).toHaveURL(/.*onboarding/);

    // Step 3: Fill out the onboarding form.
    await page.getByLabel('Seu Nome').fill('John Doe');
    await page.getByLabel('Seu Email').fill('john.doe@example.com');
    await page.getByLabel('Nome do seu Bot').fill('Meu Primeiro Bot');

    // Step 4: Submit the form.
    const submitButton = page.getByRole('button', { name: 'Criar meu Bot' });
    await submitButton.click();

    // Step 5: Expect to be redirected to the dashboard.
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 6: Verify that the new bot is listed on the dashboard.
    const botName = page.getByText('Meu Primeiro Bot');
    await expect(botName).toBeVisible();
  });
});

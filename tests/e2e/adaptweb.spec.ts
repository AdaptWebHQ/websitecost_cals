import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

// Helper to inject mock auth cookie for E2E testing bypassing Google Sign-In
async function mockLogin(context, role: 'admin' | 'public') {
  const uid = role === 'admin' ? 'admin_uid' : 'public_uid';
  const email = role === 'admin' ? 'admin@example.com' : 'public@example.com';
  const name = role === 'admin' ? 'Admin User' : 'Public User';
  const mockToken = `mock_${role}:${uid}:${email}:${name}`;

  await context.addCookies([
    {
      name: 'webcost_session_token',
      value: mockToken,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
    {
      name: 'webcost_user_role',
      value: role,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
  ]);
}

test.describe('AdaptWeb Platform E2E Suite', () => {
  
  test('Accessibility Audit - Home Page', async ({ page }) => {
    await page.goto('/');
    // Check main title
    await expect(page.locator('h3').first()).toContainText('Build your ideal website');

    // Run axe accessibility check
    const accessibilityScanResults = await new AxeBuilder({ page })
      .exclude('iframe') // Exclude Google Maps/third-party widgets if present
      .analyze();
      
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Calculator Wizard Flow & Price Estimation', async ({ page, context }) => {
    // Authenticate as public user
    await mockLogin(context, 'public');
    
    // Go to calculator
    await page.goto('/public/calculator');
    
    // 1. Business details step
    await page.fill('input[placeholder="e.g. Acme Corporation"]', 'Test Company LLC');
    await page.fill('input[placeholder="e.g. hello@acme.com"]', 'test@company.com');
    await page.fill('input[placeholder="e.g. +91 98765 43210"]', '+919999999999');
    
    const nextBtn = page.locator('button:has-text("Next Step")');
    await nextBtn.click();
    
    // 2. Industry step
    await page.click('button:has-text("Select")');
    await nextBtn.click();
    
    // 3. Package step
    await page.click('button:has-text("Select")');
    await nextBtn.click();
    
    // 4. Features step & custom addon insertion
    await page.fill('input[placeholder="e.g. Salesforce CRM Sync"]', 'Salesforce CRM Sync');
    await page.fill('input[placeholder="5000"]', '8000');
    await page.click('button:has-text("Add")');
    
    // Check that custom feature is added and listed
    await expect(page.locator('text=Salesforce CRM Sync')).toBeVisible();
    await nextBtn.click();
    
    // 5. Rush delivery timeline step
    await nextBtn.click();
    
    // 6. Summary and Finalization
    await expect(page.locator('text=Breakdown Details')).toBeVisible();
    
    // Run accessibility check on the final step
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Admin Logs Dashboard and Searching', async ({ page, context }) => {
    // Authenticate as administrator
    await mockLogin(context, 'admin');
    
    await page.goto('/admin/packages');
    
    // Check admin panel layout
    await expect(page.locator('text=Quotation Package')).toBeVisible();
    
    // Run accessibility audit on admin list
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

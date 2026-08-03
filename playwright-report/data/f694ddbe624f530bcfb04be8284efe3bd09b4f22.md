# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: adaptweb.spec.ts >> AdaptWeb Platform E2E Suite >> Admin Logs Dashboard and Searching
- Location: tests\e2e\adaptweb.spec.ts:91:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Quotation Package')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Quotation Package')

```

```yaml
- alert: Sign In | AdaptWeb Cost Calculator
- button "Click to awaken"
- main:
  - img "Logo"
  - heading "Welcome Back" [level=1]
  - paragraph: Sign in to your account to continue
  - button "Continue with Google":
    - img
    - text: Continue with Google
  - paragraph: Built by AdaptWeb
- region "Notifications alt+T"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { AxeBuilder } from '@axe-core/playwright';
  3   | 
  4   | // Helper to inject mock auth cookie for E2E testing bypassing Google Sign-In
  5   | async function mockLogin(context, role: 'admin' | 'public') {
  6   |   const uid = role === 'admin' ? 'admin_uid' : 'public_uid';
  7   |   const email = role === 'admin' ? 'admin@example.com' : 'public@example.com';
  8   |   const name = role === 'admin' ? 'Admin User' : 'Public User';
  9   |   const mockToken = `mock_${role}:${uid}:${email}:${name}`;
  10  | 
  11  |   await context.addCookies([
  12  |     {
  13  |       name: 'webcost_session_token',
  14  |       value: mockToken,
  15  |       domain: 'localhost',
  16  |       path: '/',
  17  |       httpOnly: true,
  18  |       secure: false,
  19  |       sameSite: 'Lax',
  20  |     },
  21  |     {
  22  |       name: 'webcost_user_role',
  23  |       value: role,
  24  |       domain: 'localhost',
  25  |       path: '/',
  26  |       httpOnly: true,
  27  |       secure: false,
  28  |       sameSite: 'Lax',
  29  |     },
  30  |   ]);
  31  | }
  32  | 
  33  | test.describe('AdaptWeb Platform E2E Suite', () => {
  34  |   
  35  |   test('Accessibility Audit - Home Page', async ({ page }) => {
  36  |     await page.goto('/');
  37  |     // Check main title
  38  |     await expect(page.locator('text=Build your ideal website').first()).toBeVisible();
  39  | 
  40  |     // Run axe accessibility check
  41  |     const accessibilityScanResults = await new AxeBuilder({ page })
  42  |       .exclude('iframe') // Exclude Google Maps/third-party widgets if present
  43  |       .analyze();
  44  |       
  45  |     expect(accessibilityScanResults.violations).toEqual([]);
  46  |   });
  47  | 
  48  |   test('Calculator Wizard Flow & Price Estimation', async ({ page, context }) => {
  49  |     // Authenticate as public user
  50  |     await mockLogin(context, 'public');
  51  |     
  52  |     // Go to calculator
  53  |     await page.goto('/public/calculator');
  54  |     
  55  |     // 1. Business details step
  56  |     await page.fill('input[placeholder="e.g. Acme Corporation"]', 'Test Company LLC');
  57  |     await page.fill('input[placeholder="name@company.com"]', 'test@company.com');
  58  |     await page.fill('input[placeholder="+1 (555) 000-0000"]', '+919999999999');
  59  |     
  60  |     const nextBtn = page.locator('button:has-text("Next Step")');
  61  |     await nextBtn.click();
  62  |     
  63  |     // 2. Industry step
  64  |     await page.click('button:has-text("Select")');
  65  |     await nextBtn.click();
  66  |     
  67  |     // 3. Package step
  68  |     await page.click('button:has-text("Select")');
  69  |     await nextBtn.click();
  70  |     
  71  |     // 4. Features step & custom addon insertion
  72  |     await page.fill('input[placeholder="e.g. Salesforce CRM Sync"]', 'Salesforce CRM Sync');
  73  |     await page.fill('input[placeholder="5000"]', '8000');
  74  |     await page.click('button:has-text("Add")');
  75  |     
  76  |     // Check that custom feature is added and listed
  77  |     await expect(page.locator('text=Salesforce CRM Sync')).toBeVisible();
  78  |     await nextBtn.click();
  79  |     
  80  |     // 5. Rush delivery timeline step
  81  |     await nextBtn.click();
  82  |     
  83  |     // 6. Summary and Finalization
  84  |     await expect(page.locator('text=Breakdown Details')).toBeVisible();
  85  |     
  86  |     // Run accessibility check on the final step
  87  |     const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  88  |     expect(accessibilityScanResults.violations).toEqual([]);
  89  |   });
  90  | 
  91  |   test('Admin Logs Dashboard and Searching', async ({ page, context }) => {
  92  |     // Authenticate as administrator
  93  |     await mockLogin(context, 'admin');
  94  |     
  95  |     await page.goto('/admin/packages');
  96  |     
  97  |     // Check admin panel layout
> 98  |     await expect(page.locator('text=Quotation Package')).toBeVisible();
      |                                                          ^ Error: expect(locator).toBeVisible() failed
  99  |     
  100 |     // Run accessibility audit on admin list
  101 |     const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  102 |     expect(accessibilityScanResults.violations).toEqual([]);
  103 |   });
  104 | });
  105 | 
```
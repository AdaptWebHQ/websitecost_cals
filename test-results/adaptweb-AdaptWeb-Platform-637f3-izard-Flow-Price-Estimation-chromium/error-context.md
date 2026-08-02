# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: adaptweb.spec.ts >> AdaptWeb Platform E2E Suite >> Calculator Wizard Flow & Price Estimation
- Location: tests\e2e\adaptweb.spec.ts:48:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[placeholder="e.g. Acme Corporation"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]: Sign In | AdaptWeb Cost Calculator
  - generic [ref=e13]:
    - generic [ref=e14]:
      - generic [ref=e18]: ADAPTWEB
      - generic [ref=e20]:
        - heading "Get Everything You Want" [level=1] [ref=e21]:
          - text: Get Everything
          - text: You Want
        - paragraph [ref=e22]: You can get everything you want if you work hard, trust the process, and stick to the plan.
    - generic [ref=e23]:
      - generic [ref=e24]:
        - generic [ref=e25]:
          - img "Logo" [ref=e28]
          - heading "Welcome Back" [level=2] [ref=e29]
          - paragraph [ref=e30]: Sign in with your Google account to continue to AdaptWeb
        - button "Continue with Google" [ref=e31] [cursor=pointer]:
          - img [ref=e32]
          - text: Continue with Google
        - generic [ref=e37]:
          - img [ref=e38]
          - text: Secure sign-in, no password required
      - generic [ref=e41]:
        - text: New to AdaptWeb? Signing in with Google
        - link "creates your account" [ref=e42] [cursor=pointer]:
          - /url: /register
        - text: automatically
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
> 56  |     await page.fill('input[placeholder="e.g. Acme Corporation"]', 'Test Company LLC');
      |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
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
  98  |     await expect(page.locator('text=Quotation Package')).toBeVisible();
  99  |     
  100 |     // Run accessibility audit on admin list
  101 |     const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  102 |     expect(accessibilityScanResults.violations).toEqual([]);
  103 |   });
  104 | });
  105 | 
```
# End-to-End Testing with Playwright

This directory contains comprehensive E2E tests for the OAuth Trainer application, ensuring excellent user experience across all devices, screen sizes, and user flows.

## Test Coverage

### 🏠 Homepage Tests (`e2e/homepage.spec.ts`)
- Main heading and CTA visibility
- Module cards rendering
- Navigation links functionality
- Feature cards display
- Dark mode toggle
- Mobile responsiveness

### 🎓 Learning Flow Tests (`e2e/learning-flow.spec.ts`)
- Complete learning journey (home → learn → module → lesson)
- Module progress tracking
- Unlocked module access
- Quiz section visibility
- Lesson navigation between modules
- Progress page functionality
- References page loading and external links

### 📱 Responsive Design Tests (`e2e/responsive.spec.ts`)
**Mobile (375x667 - iPhone SE)**
- Text readability and sizing
- Touch target sizes (min 44px)
- Vertical card stacking
- Scrollable content

**Tablet (768x1024 - iPad)**
- 2-column grid layout
- Full-width navigation
- Optimal touch interactions

**Desktop (1920x1080 - Full HD)**
- 3-column grid layout
- Centered content with max-width
- Readable line lengths (<1000px)

**Custom Viewports**
- Small phone (320px)
- Tablet portrait (768px)
- Desktop HD (1920px)
- Desktop 4K (3840px)

### ♿ Accessibility Tests (`e2e/accessibility.spec.ts`)
- **WCAG 2.0/2.1 AA Compliance** using Axe
- Keyboard navigation (Tab, Enter)
- Screen reader support (headings, ARIA labels, landmarks)
- Color contrast (light and dark modes)
- Focus management
- Form accessibility

## Running Tests

### Run All Tests
```bash
pnpm test
```

### Run Tests with UI (Interactive Mode)
```bash
pnpm test:ui
```

### Run Tests in Headed Mode (See Browser)
```bash
pnpm test:headed
```

### Debug Tests
```bash
pnpm test:debug
```

### Run Specific Browser
```bash
pnpm test:chrome         # Desktop Chrome only
```

### Run Mobile Tests
```bash
pnpm test:mobile         # iPhone 13 + Pixel 5
```

### Run Responsive Tests Only
```bash
pnpm test:responsive
```

### Run Accessibility Tests Only
```bash
pnpm test:a11y
```

### View Test Report
```bash
pnpm test:report
```

### Generate New Tests (Codegen)
```bash
pnpm test:codegen        # Opens browser to record interactions
```

## Test Projects (Device Coverage)

The test suite runs across **12 different configurations**:

### Desktop Browsers
- Desktop Chrome
- Desktop Firefox
- Desktop Safari

### Mobile Devices - iOS
- iPhone 13
- iPhone 13 Pro
- iPad Pro

### Mobile Devices - Android
- Pixel 5
- Galaxy S9+

### Custom Viewports
- Small Phone (320px) - Smallest modern device
- Tablet Portrait (768px)
- Desktop HD (1920px)
- Desktop 4K (3840px)

## CI/CD Integration

Tests are configured to run in CI environments with:
- **Retry on failure**: 2 retries on CI
- **Sequential execution**: Prevents race conditions
- **Full tracing**: On first retry for debugging
- **Screenshots**: On failure
- **Video recording**: Retained on failure

### Example GitHub Actions Workflow
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: npx playwright install --with-deps
      - run: pnpm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Writing New Tests

### Test Structure Template
```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/your-page')
  })

  test('should do something', async ({ page }) => {
    // Arrange
    const element = page.getByRole('button', { name: /Click Me/i })

    // Act
    await element.click()

    // Assert
    await expect(page).toHaveURL('/expected-url')
  })
})
```

### Best Practices

1. **Use Semantic Locators**
   ```typescript
   // ✅ Good: Semantic, resilient to changes
   page.getByRole('button', { name: /Submit/i })
   page.getByText('Welcome back')
   page.getByLabel('Email address')

   // ❌ Avoid: Fragile, breaks with styling changes
   page.locator('.btn-primary')
   page.locator('#submit-button')
   ```

2. **Wait for Visibility**
   ```typescript
   // ✅ Good: Wait for element to be ready
   await expect(page.getByText('Success')).toBeVisible()

   // ❌ Avoid: Flaky, might pass before element appears
   const text = await page.textContent('div')
   expect(text).toContain('Success')
   ```

3. **Test User Flows, Not Implementation**
   ```typescript
   // ✅ Good: Tests user behavior
   test('user can complete purchase', async ({ page }) => {
     await page.getByRole('button', { name: /Add to Cart/i }).click()
     await page.getByRole('link', { name: /Checkout/i }).click()
     await expect(page.getByText('Order Confirmed')).toBeVisible()
   })

   // ❌ Avoid: Tests internal state
   test('cart state updates', async ({ page }) => {
     const cart = await page.evaluate(() => window.__CART__)
     expect(cart.items.length).toBe(1)
   })
   ```

4. **Use Test Fixtures for Common Setup**
   ```typescript
   test.describe('Authenticated User', () => {
     test.beforeEach(async ({ page }) => {
       // Common setup
       await page.goto('/')
       // Simulate logged-in state if needed
     })

     test('can view profile', async ({ page }) => {
       // Test specific to authenticated user
     })
   })
   ```

## Debugging Failed Tests

### View Screenshots
Failed tests automatically capture screenshots:
```
test-results/
  homepage-Homepage-should-display-main-heading/
    test-failed-1.png
```

### View Videos
Failed tests retain video recordings:
```
test-results/
  homepage-Homepage-should-display-main-heading/
    video.webm
```

### View Trace
Open trace viewer for detailed debugging:
```bash
npx playwright show-trace test-results/.../trace.zip
```

### Run in Debug Mode
Step through tests line-by-line:
```bash
pnpm test:debug
```

## Accessibility Testing Notes

The accessibility tests use `@axe-core/playwright` to scan for WCAG violations:

- **Level A and AA** compliance checked
- **WCAG 2.0 and 2.1** standards
- Tests both **light and dark mode** color contrast
- Validates **keyboard navigation**
- Checks **screen reader** compatibility

### Common Issues to Fix

1. **Missing Alt Text**: Add `alt` attributes to all images
2. **Low Contrast**: Ensure 4.5:1 ratio for text
3. **Missing Labels**: All form inputs need labels
4. **Heading Hierarchy**: Don't skip heading levels (h1 → h3)
5. **Focus Indicators**: Ensure visible focus states

## Performance Testing (Future)

Consider adding:
- Lighthouse CI for performance scoring
- Core Web Vitals monitoring
- Bundle size tracking

## Questions?

For Playwright documentation: https://playwright.dev
For accessibility best practices: https://www.w3.org/WAI/WCAG21/quickref/

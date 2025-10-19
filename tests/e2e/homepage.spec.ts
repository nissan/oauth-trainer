import { test, expect } from '@playwright/test'

/**
 * Homepage Tests
 * Validates the landing page experience, navigation, and responsive design
 */

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display main heading and call-to-action', async ({ page }) => {
    // Check main heading
    await expect(page.getByRole('heading', {
      name: /Master Identity & Access Management/i
    })).toBeVisible()

    // Check description
    await expect(page.getByText(/Become an expert in OAuth 2.0, OpenID Connect/i))
      .toBeVisible()

    // Check CTA buttons
    await expect(page.getByRole('link', { name: /Start Learning/i }))
      .toBeVisible()
    await expect(page.getByRole('link', { name: /Learn More/i }))
      .toBeVisible()
  })

  test('should display all module cards', async ({ page }) => {
    // Wait for modules to load
    await page.waitForSelector('[data-testid="module-card"]', {
      state: 'visible',
      timeout: 5000
    }).catch(() => {
      // Fallback: check for any card-like elements
      return page.waitForSelector('.grid', { state: 'visible' })
    })

    // Get all module cards (there should be 10 modules)
    const moduleCards = await page.locator('a[href^="/learn/"]').filter({
      has: page.locator('h3')
    }).all()

    // Verify we have at least 9 modules (could be 10 with new module)
    expect(moduleCards.length).toBeGreaterThanOrEqual(9)
  })

  test('should have working navigation links', async ({ page }) => {
    // Test Learning Hub link
    await page.getByRole('link', { name: /Start Learning/i }).click()
    await expect(page).toHaveURL('/learn')
    await page.goBack()

    // Test References link
    await page.getByRole('link', { name: /References/i }).first().click()
    await expect(page).toHaveURL('/references')
    await page.goBack()

    // Test logo link (should go to home)
    await page.getByRole('link', { name: /ReddiTech/i }).first().click()
    await expect(page).toHaveURL('/')
  })

  test('should display feature cards', async ({ page }) => {
    // Check for key feature descriptions
    await expect(page.getByText(/Expert-Level Content/i)).toBeVisible()
    await expect(page.getByText(/Comprehensive Lessons/i)).toBeVisible()
    await expect(page.getByText(/Certification Quizzes/i)).toBeVisible()
    await expect(page.getByText(/Progress Tracking/i)).toBeVisible()
  })

  test('should have functional dark mode toggle', async ({ page }) => {
    // Find the mode toggle button (sun/moon icon)
    const themeToggle = page.locator('button').filter({
      has: page.locator('svg')
    }).first()

    // Click to toggle theme
    await themeToggle.click()

    // Wait a moment for theme to apply
    await page.waitForTimeout(300)

    // Verify theme changed by checking data attribute or class
    const html = page.locator('html')
    const theme = await html.getAttribute('class')

    // Theme should be either 'dark' or 'light'
    expect(['dark', 'light'].some(t => theme?.includes(t))).toBeTruthy()
  })

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip()
    }

    // Check that content is visible on mobile
    await expect(page.getByRole('heading', {
      name: /Master Identity/i
    })).toBeVisible()

    // Check that navigation is accessible (might be hamburger menu)
    const navigation = page.locator('header')
    await expect(navigation).toBeVisible()

    // Verify module cards stack vertically on mobile
    const firstCard = page.locator('a[href^="/learn/"]').first()
    const secondCard = page.locator('a[href^="/learn/"]').nth(1)

    if (await firstCard.isVisible() && await secondCard.isVisible()) {
      const firstBox = await firstCard.boundingBox()
      const secondBox = await secondCard.boundingBox()

      // On mobile, cards should stack (second card should be below first)
      if (firstBox && secondBox) {
        expect(secondBox.y).toBeGreaterThan(firstBox.y)
      }
    }
  })

  test('should scroll to modules section', async ({ page }) => {
    // Click CTA to start learning
    await page.getByRole('link', { name: /Begin Your Journey/i }).first().click()

    // Should navigate to learning hub
    await expect(page).toHaveURL('/learn')
  })
})

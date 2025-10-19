import { test, expect } from '@playwright/test'

/**
 * Learning Flow Tests
 * Validates the complete learning journey from module selection through lesson completion
 */

test.describe('Learning Flow', () => {
  test('should navigate through complete learning flow', async ({ page }) => {
    // 1. Start at homepage
    await page.goto('/')

    // 2. Navigate to Learning Hub
    await page.getByRole('link', { name: /Start Learning/i }).first().click()
    await expect(page).toHaveURL('/learn')

    // 3. Verify Learning Hub page loaded
    await expect(page.getByRole('heading', { name: /Learning Hub/i }))
      .toBeVisible()

    // 4. Click on Auth Fundamentals module
    const authFundamentalsLink = page.getByRole('link', {
      name: /Authentication.*Authorization Fundamentals/i
    }).or(page.locator('a[href="/learn/01-auth-fundamentals"]')).first()

    await authFundamentalsLink.click()
    await expect(page).toHaveURL('/learn/01-auth-fundamentals')

    // 5. Verify module page loaded with lessons
    await expect(page.getByText(/Learning Objectives/i)).toBeVisible()
    await expect(page.getByText(/Lessons/i)).toBeVisible()

    // 6. Click first lesson (Auth vs Authz)
    const firstLesson = page.locator('a[href*="/01-auth-fundamentals/"]').first()
    await firstLesson.click()

    // 7. Verify lesson content loaded
    await expect(page.getByRole('heading', {
      name: /Authentication.*Authorization/i
    })).toBeVisible()

    // 8. Verify lesson navigation exists
    const nextButton = page.getByRole('link', { name: /Next/i }).or(
      page.getByRole('button', { name: /Next/i })
    )

    if (await nextButton.isVisible()) {
      await nextButton.click()

      // Should navigate to next lesson
      await expect(page.url()).toContain('/learn/01-auth-fundamentals/')
    }
  })

  test('should display module progress correctly', async ({ page }) => {
    await page.goto('/learn')

    // Progress card should be visible
    await expect(page.getByText(/Overall Progress/i)).toBeVisible()

    // Check for progress statistics
    await expect(page.getByText(/lessons completed/i)).toBeVisible()
    await expect(page.getByText(/Modules/i)).toBeVisible()
  })

  test('should allow accessing any module (no locks)', async ({ page }) => {
    await page.goto('/learn')

    // Get all module links
    const moduleLinks = await page.locator('a[href^="/learn/"][href$!="/learn"]')
      .filter({ has: page.locator('h3') })
      .all()

    // Verify at least one module is accessible
    expect(moduleLinks.length).toBeGreaterThan(0)

    // Try clicking the first module
    if (moduleLinks.length > 0) {
      await moduleLinks[0].click()

      // Should navigate to a module page
      await expect(page.url()).toMatch(/\/learn\/[a-z-]+$/)

      // Module page should load
      await expect(page.getByText(/Learning Objectives/i)).toBeVisible()
    }
  })

  test('should show quiz section on module page', async ({ page }) => {
    await page.goto('/learn/01-auth-fundamentals')

    // Scroll to quiz section
    await page.getByText(/Module Quiz/i).scrollIntoViewIfNeeded()

    // Verify quiz card is visible
    await expect(page.getByText(/Module Quiz/i)).toBeVisible()
    await expect(page.getByText(/Test your knowledge/i)).toBeVisible()

    // Verify quiz button exists
    const quizButton = page.getByRole('link', { name: /Take Quiz/i })
      .or(page.getByRole('link', { name: /Retake Quiz/i }))

    await expect(quizButton).toBeVisible()
  })

  test('should handle lesson navigation between modules', async ({ page }) => {
    // Start at a lesson
    await page.goto('/learn/01-auth-fundamentals/01-auth-vs-authz')

    // Verify lesson loaded
    await expect(page.getByRole('heading', {
      name: /Authentication.*Authorization/i
    })).toBeVisible()

    // Check for breadcrumb or back navigation
    const backToModule = page.getByRole('link', { name: /Back/i })
      .or(page.getByRole('link', { name: /Auth Fundamentals/i }))
      .or(page.getByRole('link', { name: /Module/i }))

    if (await backToModule.isVisible()) {
      await backToModule.click()
      await expect(page).toHaveURL('/learn/01-auth-fundamentals')
    }
  })
})

test.describe('Progress Tracking', () => {
  test('should navigate to progress page', async ({ page }) => {
    await page.goto('/')

    // Click "My Progress" link
    const progressLink = page.getByRole('link', { name: /My Progress/i }).first()
    await progressLink.click()

    await expect(page).toHaveURL('/progress')
  })

  test('should display progress statistics', async ({ page }) => {
    await page.goto('/progress')

    // Check for progress indicators
    await expect(page.getByText(/Progress/i)).toBeVisible()

    // Should show some statistics
    const statsVisible = await page.getByText(/Completed/i).isVisible()
      .catch(() => false)

    // Either stats are visible or it's a fresh start
    expect(statsVisible || await page.getByText(/Start/i).isVisible()).toBeTruthy()
  })
})

test.describe('References Page', () => {
  test('should load references page', async ({ page }) => {
    await page.goto('/references')

    // Check main heading
    await expect(page.getByRole('heading', {
      name: /References.*Attributions/i
    })).toBeVisible()

    // Check for reference sections
    await expect(page.getByText(/Primary Reference Materials/i)).toBeVisible()
    await expect(page.getByText(/Course Development/i)).toBeVisible()
  })

  test('should have working external reference links', async ({ page, context }) => {
    await page.goto('/references')

    // Find an external link (e.g., to RFC 6749)
    const externalLinks = await page.locator('a[href^="http"]').all()

    expect(externalLinks.length).toBeGreaterThan(0)

    // Verify links have proper attributes
    for (const link of externalLinks.slice(0, 3)) {
      const href = await link.getAttribute('href')
      const target = await link.getAttribute('target')
      const rel = await link.getAttribute('rel')

      expect(href).toBeTruthy()
      expect(target).toBe('_blank') // Should open in new tab
      expect(rel).toContain('noopener') // Should have security attributes
    }
  })
})

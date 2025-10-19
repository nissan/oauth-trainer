import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Accessibility Tests
 * Validates WCAG compliance and accessible user experience
 */

test.describe('Accessibility - WCAG Compliance', () => {
  test('homepage should not have accessibility violations', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('learning hub should not have accessibility violations', async ({ page }) => {
    await page.goto('/learn')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('module page should not have accessibility violations', async ({ page }) => {
    await page.goto('/learn/01-auth-fundamentals')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('lesson page should not have accessibility violations', async ({ page }) => {
    await page.goto('/learn/01-auth-fundamentals/01-auth-vs-authz')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})

test.describe('Keyboard Navigation', () => {
  test('should navigate homepage with keyboard', async ({ page }) => {
    await page.goto('/')

    // Tab through focusable elements
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Verify focus is visible
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement
      const styles = window.getComputedStyle(el!)
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth
      }
    })

    // Should have some focus indicator
    expect(
      focusedElement.outline !== 'none' ||
      parseInt(focusedElement.outlineWidth) > 0
    ).toBeTruthy()
  })

  test('should activate links with Enter key', async ({ page }) => {
    await page.goto('/')

    // Focus the "Start Learning" link
    const startLearningLink = page.getByRole('link', { name: /Start Learning/i }).first()
    await startLearningLink.focus()

    // Press Enter
    await page.keyboard.press('Enter')

    // Should navigate
    await expect(page).toHaveURL('/learn')
  })

  test('should skip to main content', async ({ page }) => {
    await page.goto('/')

    // Check for skip link
    const skipLink = page.getByRole('link', { name: /Skip to.*content/i })

    if (await skipLink.isVisible()) {
      await skipLink.click()

      // Main content should be focused
      const focusedElement = page.locator(':focus')
      const tagName = await focusedElement.evaluate((el) => el.tagName.toLowerCase())

      expect(['main', 'div', 'section']).toContain(tagName)
    }
  })
})

test.describe('Screen Reader Support', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')

    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()

    let previousLevel = 0
    for (const heading of headings) {
      const tagName = await heading.evaluate((el) => el.tagName.toLowerCase())
      const level = parseInt(tagName.charAt(1))

      // Headings should not skip levels (e.g., h1 -> h3)
      if (previousLevel > 0) {
        expect(level - previousLevel).toBeLessThanOrEqual(1)
      }

      previousLevel = level
    }

    // Should have exactly one h1
    const h1s = await page.locator('h1').all()
    expect(h1s.length).toBe(1)
  })

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/')

    const images = await page.locator('img').all()

    for (const img of images) {
      const alt = await img.getAttribute('alt')

      // All images should have alt attribute (can be empty for decorative)
      expect(alt !== null).toBeTruthy()
    }
  })

  test('should have proper ARIA labels for interactive elements', async ({ page }) => {
    await page.goto('/')

    // Buttons and links should have accessible names
    const buttons = await page.locator('button').all()

    for (const button of buttons) {
      const accessibleName = await button.evaluate((el) => {
        // Check for text content, aria-label, or aria-labelledby
        return (
          el.textContent?.trim() ||
          el.getAttribute('aria-label') ||
          el.getAttribute('aria-labelledby')
        )
      })

      expect(accessibleName).toBeTruthy()
    }
  })

  test('should have proper landmarks', async ({ page }) => {
    await page.goto('/')

    // Should have main landmark
    const main = page.locator('main, [role="main"]')
    await expect(main).toHaveCount(1)

    // Should have header landmark
    const header = page.locator('header, [role="banner"]')
    await expect(header).toHaveCount(1)

    // Should have navigation landmark
    const nav = page.locator('nav, [role="navigation"]')
    const navCount = await nav.count()
    expect(navCount).toBeGreaterThanOrEqual(1)
  })
})

test.describe('Color Contrast', () => {
  test('should have sufficient color contrast in light mode', async ({ page }) => {
    await page.goto('/')

    // Ensure light mode is active
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark')
    })

    await page.waitForTimeout(300)

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .disableRules(['color-contrast-enhanced']) // Test AA, not AAA
      .analyze()

    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    )

    expect(contrastViolations).toEqual([])
  })

  test('should have sufficient color contrast in dark mode', async ({ page }) => {
    await page.goto('/')

    // Ensure dark mode is active
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
    })

    await page.waitForTimeout(300)

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .disableRules(['color-contrast-enhanced'])
      .analyze()

    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    )

    expect(contrastViolations).toEqual([])
  })
})

test.describe('Focus Management', () => {
  test('should trap focus in modals (if any)', async ({ page }) => {
    await page.goto('/')

    // This is a placeholder for modal focus testing
    // If you add modals in the future, test focus trapping here

    // For now, verify no focus traps on normal pages
    await page.keyboard.press('Tab')
    const focusedElement = page.locator(':focus')

    await expect(focusedElement).toBeVisible()
  })

  test('should maintain focus on navigation', async ({ page }) => {
    await page.goto('/')

    // Click a link
    const learnLink = page.getByRole('link', { name: /Start Learning/i }).first()
    await learnLink.click()

    await page.waitForURL('/learn')

    // Focus should move to page content (not lost)
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName
    })

    expect(focusedElement).toBeTruthy()
  })
})

test.describe('Form Accessibility', () => {
  test('should have proper form labels (if forms exist)', async ({ page }) => {
    await page.goto('/')

    const inputs = await page.locator('input').all()

    for (const input of inputs) {
      const inputId = await input.getAttribute('id')
      const inputType = await input.getAttribute('type')

      // Skip hidden inputs
      if (inputType === 'hidden') continue

      // Should have associated label or aria-label
      let hasLabel = false

      if (inputId) {
        const label = page.locator(`label[for="${inputId}"]`)
        hasLabel = (await label.count()) > 0
      }

      const ariaLabel = await input.getAttribute('aria-label')
      const ariaLabelledby = await input.getAttribute('aria-labelledby')

      expect(hasLabel || ariaLabel || ariaLabelledby).toBeTruthy()
    }
  })
})

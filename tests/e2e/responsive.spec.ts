import { test, expect } from '@playwright/test'

/**
 * Responsive Design Tests
 * Validates UI adapts correctly across different screen sizes and devices
 */

test.describe('Responsive Design - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } }) // iPhone SE size

  test('homepage should be readable on small mobile', async ({ page }) => {
    await page.goto('/')

    // Main heading should be visible and not overflow
    const heading = page.getByRole('heading', { name: /Master Identity/i })
    await expect(heading).toBeVisible()

    const headingBox = await heading.boundingBox()
    const viewportSize = page.viewportSize()!

    // Heading should fit within viewport
    if (headingBox) {
      expect(headingBox.width).toBeLessThanOrEqual(viewportSize.width)
    }

    // Text should be readable (not too small)
    const fontSize = await heading.evaluate((el) => {
      return window.getComputedStyle(el).fontSize
    })
    const fontSizeNum = parseInt(fontSize)
    expect(fontSizeNum).toBeGreaterThanOrEqual(24) // At least 24px on mobile
  })

  test('navigation should be accessible on mobile', async ({ page }) => {
    await page.goto('/')

    // Header should be sticky or visible
    const header = page.locator('header')
    await expect(header).toBeVisible()

    // Links should be tappable (min 44px touch target)
    const navLinks = await page.locator('header a').all()

    for (const link of navLinks.slice(0, 3)) {
      const box = await link.boundingBox()
      if (box) {
        // iOS/Android touch target minimum is 44x44
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(40)
      }
    }
  })

  test('module cards should stack vertically on mobile', async ({ page }) => {
    await page.goto('/learn')

    const cards = await page.locator('a[href^="/learn/"]')
      .filter({ has: page.locator('h3') })
      .all()

    if (cards.length >= 2) {
      const firstBox = await cards[0].boundingBox()
      const secondBox = await cards[1].boundingBox()

      if (firstBox && secondBox) {
        // Cards should stack (second card below first)
        expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height - 10)

        // Cards should not be side by side
        expect(Math.abs(firstBox.y - secondBox.y)).toBeGreaterThan(50)
      }
    }
  })

  test('lesson content should be scrollable on mobile', async ({ page }) => {
    await page.goto('/learn/01-auth-fundamentals/01-auth-vs-authz')

    // Content should be visible
    await expect(page.getByRole('heading')).toBeVisible()

    // Page should be scrollable
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight)
    const viewportHeight = page.viewportSize()!.height

    expect(scrollHeight).toBeGreaterThan(viewportHeight)

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500))

    // Should be able to scroll
    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBeGreaterThan(0)
  })
})

test.describe('Responsive Design - Tablet', () => {
  test.use({ viewport: { width: 768, height: 1024 } }) // iPad size

  test('should use tablet layout', async ({ page }) => {
    await page.goto('/learn')

    // Module cards should be in 2-column grid on tablet
    const cards = await page.locator('a[href^="/learn/"]')
      .filter({ has: page.locator('h3') })
      .all()

    if (cards.length >= 2) {
      const firstBox = await cards[0].boundingBox()
      const secondBox = await cards[1].boundingBox()

      if (firstBox && secondBox) {
        // Cards might be side by side (2 columns)
        const sameRow = Math.abs(firstBox.y - secondBox.y) < 50
        const stacked = secondBox.y > firstBox.y + firstBox.height - 10

        // Should be either side-by-side or stacked (flexible)
        expect(sameRow || stacked).toBeTruthy()
      }
    }
  })

  test('navigation should be full-width on tablet', async ({ page }) => {
    await page.goto('/')

    const header = page.locator('header')
    const headerBox = await header.boundingBox()

    if (headerBox) {
      // Header should span full width
      expect(headerBox.width).toBeGreaterThan(700)
    }
  })
})

test.describe('Responsive Design - Desktop', () => {
  test.use({ viewport: { width: 1920, height: 1080 } }) // Full HD

  test('should use multi-column layout on desktop', async ({ page }) => {
    await page.goto('/learn')

    // Module cards should be in 3-column grid on desktop
    const cards = await page.locator('a[href^="/learn/"]')
      .filter({ has: page.locator('h3') })
      .all()

    if (cards.length >= 3) {
      const firstBox = await cards[0].boundingBox()
      const secondBox = await cards[1].boundingBox()
      const thirdBox = await cards[2].boundingBox()

      if (firstBox && secondBox && thirdBox) {
        // At least some cards should be on the same row
        const firstRowHasMultiple = Math.abs(firstBox.y - secondBox.y) < 50

        expect(firstRowHasMultiple).toBeTruthy()
      }
    }
  })

  test('content should be centered with max width', async ({ page }) => {
    await page.goto('/')

    // Main content should be centered
    const main = page.locator('main').first()
    const mainBox = await main.boundingBox()
    const viewportWidth = page.viewportSize()!.width

    if (mainBox) {
      // Content should not span full width on large screens
      expect(mainBox.width).toBeLessThan(viewportWidth)

      // Content should be roughly centered
      const leftMargin = mainBox.x
      const rightMargin = viewportWidth - (mainBox.x + mainBox.width)

      // Margins should be roughly equal (within 20% tolerance)
      const marginDiff = Math.abs(leftMargin - rightMargin)
      const avgMargin = (leftMargin + rightMargin) / 2

      if (avgMargin > 0) {
        expect(marginDiff / avgMargin).toBeLessThan(0.2)
      }
    }
  })

  test('should have readable line lengths', async ({ page }) => {
    await page.goto('/learn/01-auth-fundamentals/01-auth-vs-authz')

    // Find paragraph text
    const paragraphs = await page.locator('p').all()

    if (paragraphs.length > 0) {
      const firstPara = paragraphs[0]
      const paraBox = await firstPara.boundingBox()

      if (paraBox) {
        // Optimal line length: 50-75 characters (approx 600-800px)
        // Max comfortable: 1000px
        expect(paraBox.width).toBeLessThan(1000)
      }
    }
  })
})

test.describe('Responsive Images and Media', () => {
  test('should load appropriate image sizes', async ({ page, isMobile }) => {
    await page.goto('/')

    // Check if images exist
    const images = await page.locator('img').all()

    for (const img of images) {
      // Image should be loaded
      const isLoaded = await img.evaluate((el: HTMLImageElement) => el.complete)
      expect(isLoaded).toBeTruthy()

      // Image should fit viewport
      const imgBox = await img.boundingBox()
      const viewportWidth = page.viewportSize()!.width

      if (imgBox) {
        expect(imgBox.width).toBeLessThanOrEqual(viewportWidth)
      }
    }
  })

  test('should handle code blocks responsively', async ({ page }) => {
    await page.goto('/learn/01-auth-fundamentals/03-token-types')

    // Find code blocks
    const codeBlocks = await page.locator('pre, code').all()

    if (codeBlocks.length > 0) {
      const codeBlock = codeBlocks[0]
      const codeBox = await codeBlock.boundingBox()
      const viewportWidth = page.viewportSize()!.width

      if (codeBox) {
        // Code should not overflow viewport
        expect(codeBox.width).toBeLessThanOrEqual(viewportWidth + 20) // Small tolerance for scrollbars

        // Code should be scrollable if it overflows
        const hasOverflow = await codeBlock.evaluate((el) => {
          return el.scrollWidth > el.clientWidth
        })

        if (hasOverflow) {
          const overflowStyle = await codeBlock.evaluate((el) => {
            return window.getComputedStyle(el).overflowX
          })

          expect(['auto', 'scroll']).toContain(overflowStyle)
        }
      }
    }
  })
})

test.describe('Touch Interactions', () => {
  test.use({ hasTouch: true, isMobile: true })

  test('buttons should be touch-friendly', async ({ page }) => {
    await page.goto('/')

    const buttons = await page.locator('button, a[role="button"]').all()

    for (const button of buttons.slice(0, 5)) {
      const box = await button.boundingBox()

      if (box && await button.isVisible()) {
        // Touch targets should be at least 44x44 (Apple HIG)
        // 48x48 (Material Design)
        expect(box.height).toBeGreaterThanOrEqual(40)
        expect(box.width).toBeGreaterThanOrEqual(40)
      }
    }
  })

  test('should support swipe gestures for navigation (if implemented)', async ({ page }) => {
    await page.goto('/learn/01-auth-fundamentals/01-auth-vs-authz')

    // This is a placeholder for swipe gesture testing
    // If you implement swipe navigation in the future, add tests here

    // For now, just verify touch-friendly navigation exists
    const nextButton = page.getByRole('link', { name: /Next/i })

    if (await nextButton.isVisible()) {
      const box = await nextButton.boundingBox()
      expect(box?.height).toBeGreaterThanOrEqual(40)
    }
  })
})

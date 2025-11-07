/**
 * Safe PostHog analytics wrapper
 * Ensures PostHog is only called in the browser and handles initialization
 */

import posthog from "posthog-js"

let isInitialized = false

export function initPostHog() {
  if (typeof window === "undefined") return
  if (isInitialized) return

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) {
    console.warn("PostHog key not found")
    return
  }

  posthog.init(key, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false, // We'll capture manually
    capture_pageleave: true,
    debug: process.env.NODE_ENV === "development",
  })

  isInitialized = true
}

/**
 * Safely capture an event - only works in browser
 */
export function captureEvent(
  eventName: string,
  properties?: Record<string, unknown>
) {
  if (typeof window === "undefined") return

  if (!isInitialized) {
    initPostHog()
  }

  posthog.capture(eventName, properties)
}

/**
 * Safely identify a user - only works in browser
 */
export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (typeof window === "undefined") return

  if (!isInitialized) {
    initPostHog()
  }

  posthog.identify(userId, traits)
}

/**
 * Reset PostHog (e.g., on logout)
 */
export function resetAnalytics() {
  if (typeof window === "undefined") return

  if (!isInitialized) return

  posthog.reset()
}

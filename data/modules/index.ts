/**
 * ReddiTech's Curious Auth Builder Training Course
 * Central module registry
 */

import { executiveOverviewModule } from "./00-executive-overview"
// Module 01 now uses MDX content from content/modules/01-auth-fundamentals/
// import { authFundamentalsModule } from "./01-auth-fundamentals"
// Module 02 now uses MDX content from content/modules/02-oauth2/
// import { oauth2Module } from "./02-oauth2"
import { oidcModule } from "./03-oidc"
import { samlModule } from "./04-saml"
import { fido2Module } from "./05-fido2"
import { zanzibarModule } from "./06-zanzibar"
import { emergingTrendsModule } from "./07-emerging-trends"
import { ssiDecentralizedIdentityModule } from "./08-ssi-decentralized-identity"
import { appliedApplicationsModule } from "./09-applied-applications"
import type { Module, CourseStructure } from "@/types"

export const modules: Module[] = [
  executiveOverviewModule,
  // authFundamentalsModule, // Now uses MDX from content/modules/01-auth-fundamentals/
  // oauth2Module, // Now uses MDX from content/modules/02-oauth2/
  oidcModule,
  samlModule,
  fido2Module,
  zanzibarModule,
  emergingTrendsModule,
  ssiDecentralizedIdentityModule,
  appliedApplicationsModule,
]

export function getCourseStructure(): CourseStructure {
  const totalLessons = modules.reduce((sum, mod) => sum + mod.lessons.length, 0)
  const totalDuration = modules.reduce((sum, mod) => sum + mod.estimatedHours, 0)

  return {
    modules,
    totalLessons,
    totalDuration,
  }
}

export function getModuleBySlug(slug: string): Module | undefined {
  return modules.find((mod) => mod.slug === slug)
}

export function getModuleById(id: string): Module | undefined {
  return modules.find((mod) => mod.id === id)
}

export function getLessonBySlug(moduleSlug: string, lessonSlug: string) {
  const module = getModuleBySlug(moduleSlug)
  return module?.lessons.find((lesson) => lesson.slug === lessonSlug)
}

export function getNextLesson(moduleSlug: string, currentLessonSlug: string) {
  const module = getModuleBySlug(moduleSlug)
  if (!module) return null

  const currentIndex = module.lessons.findIndex(
    (lesson) => lesson.slug === currentLessonSlug,
  )

  if (currentIndex === -1) return null

  // Return next lesson in same module
  if (currentIndex < module.lessons.length - 1) {
    return {
      module,
      lesson: module.lessons[currentIndex + 1],
    }
  }

  // Return first lesson of next module
  const moduleIndex = modules.findIndex((mod) => mod.slug === moduleSlug)
  if (moduleIndex < modules.length - 1) {
    const nextModule = modules[moduleIndex + 1]
    return {
      module: nextModule,
      lesson: nextModule.lessons[0],
    }
  }

  return null
}

export function getPreviousLesson(moduleSlug: string, currentLessonSlug: string) {
  const module = getModuleBySlug(moduleSlug)
  if (!module) return null

  const currentIndex = module.lessons.findIndex(
    (lesson) => lesson.slug === currentLessonSlug,
  )

  if (currentIndex === -1) return null

  // Return previous lesson in same module
  if (currentIndex > 0) {
    return {
      module,
      lesson: module.lessons[currentIndex - 1],
    }
  }

  // Return last lesson of previous module
  const moduleIndex = modules.findIndex((mod) => mod.slug === moduleSlug)
  if (moduleIndex > 0) {
    const prevModule = modules[moduleIndex - 1]
    return {
      module: prevModule,
      lesson: prevModule.lessons[prevModule.lessons.length - 1],
    }
  }

  return null
}

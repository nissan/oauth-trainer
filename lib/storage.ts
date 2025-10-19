/**
 * OAuth Trainer - Local Storage Management
 * Handles persisting and retrieving user progress
 */

import type {
  UserProgress,
  ModuleProgress,
  LessonProgress,
  QuizAttempt,
  LearningStats,
} from "@/types"

const STORAGE_KEY = "oauth_trainer_progress"
const USER_ID_KEY = "oauth_trainer_user_id"

/**
 * Generate a unique user ID for anonymous tracking
 */
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get or create user ID
 */
export function getUserId(): string {
  if (typeof window === "undefined") return ""

  let userId = localStorage.getItem(USER_ID_KEY)
  if (!userId) {
    userId = generateUserId()
    localStorage.setItem(USER_ID_KEY, userId)
  }
  return userId
}

/**
 * Initialize user progress if it doesn't exist
 */
function initializeUserProgress(): UserProgress {
  const userId = getUserId()
  return {
    userId,
    createdAt: new Date(),
    lastActive: new Date(),
    moduleProgress: {},
    totalLessonsCompleted: 0,
    totalQuizzesPassed: 0,
    totalTimeSpent: 0,
    badgesEarned: [],
  }
}

/**
 * Get user progress from localStorage
 */
export function getUserProgress(): UserProgress {
  if (typeof window === "undefined") return initializeUserProgress()

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return initializeUserProgress()
  }

  try {
    const parsed = JSON.parse(stored)
    // Convert date strings back to Date objects
    parsed.createdAt = new Date(parsed.createdAt)
    parsed.lastActive = new Date(parsed.lastActive)

    // Convert dates in module progress
    for (const moduleId in parsed.moduleProgress) {
      const mp = parsed.moduleProgress[moduleId]
      if (mp.startedAt) mp.startedAt = new Date(mp.startedAt)
      if (mp.completedAt) mp.completedAt = new Date(mp.completedAt)

      // Convert dates in lesson progress
      for (const lessonId in mp.lessonProgress) {
        const lp = mp.lessonProgress[lessonId]
        if (lp.completedAt) lp.completedAt = new Date(lp.completedAt)
      }

      // Convert dates in quiz attempts
      mp.quizAttempts = mp.quizAttempts.map((attempt: QuizAttempt) => ({
        ...attempt,
        completedAt: new Date(attempt.completedAt),
      }))
    }

    return parsed
  } catch (error) {
    console.error("Error parsing user progress:", error)
    return initializeUserProgress()
  }
}

/**
 * Save user progress to localStorage
 */
export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return

  progress.lastActive = new Date()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

/**
 * Mark a lesson as completed
 */
export function completeLesson(
  moduleId: string,
  lessonId: string,
  timeSpent: number,
): void {
  const progress = getUserProgress()

  if (!progress.moduleProgress[moduleId]) {
    progress.moduleProgress[moduleId] = {
      moduleId,
      started: true,
      startedAt: new Date(),
      completed: false,
      lessonProgress: {},
      quizAttempts: [],
      bestQuizScore: 0,
      badgeEarned: false,
      totalTimeSpent: 0,
    }
  }

  const moduleProgress = progress.moduleProgress[moduleId]

  if (!moduleProgress.lessonProgress[lessonId]?.completed) {
    progress.totalLessonsCompleted++
  }

  moduleProgress.lessonProgress[lessonId] = {
    lessonId,
    completed: true,
    completedAt: new Date(),
    timeSpent,
  }

  moduleProgress.totalTimeSpent += timeSpent
  progress.totalTimeSpent += timeSpent
  progress.currentModuleId = moduleId
  progress.currentLessonId = lessonId

  saveUserProgress(progress)
}

/**
 * Record a quiz attempt
 */
export function recordQuizAttempt(
  moduleId: string,
  quizAttempt: Omit<QuizAttempt, "attemptNumber" | "completedAt">,
): void {
  const progress = getUserProgress()

  if (!progress.moduleProgress[moduleId]) {
    progress.moduleProgress[moduleId] = {
      moduleId,
      started: true,
      startedAt: new Date(),
      completed: false,
      lessonProgress: {},
      quizAttempts: [],
      bestQuizScore: 0,
      badgeEarned: false,
      totalTimeSpent: 0,
    }
  }

  const moduleProgress = progress.moduleProgress[moduleId]

  const attemptNumber = moduleProgress.quizAttempts.length + 1

  const fullAttempt: QuizAttempt = {
    ...quizAttempt,
    attemptNumber,
    completedAt: new Date(),
  }

  moduleProgress.quizAttempts.push(fullAttempt)

  // Update best score
  if (quizAttempt.score > moduleProgress.bestQuizScore) {
    moduleProgress.bestQuizScore = quizAttempt.score
  }

  // Check if quiz passed
  if (quizAttempt.passed && !moduleProgress.completed) {
    progress.totalQuizzesPassed++
  }

  saveUserProgress(progress)
}

/**
 * Award a badge for completing a module
 */
export function awardBadge(moduleId: string, badgeId: string): void {
  const progress = getUserProgress()

  if (!progress.badgesEarned.includes(badgeId)) {
    progress.badgesEarned.push(badgeId)
  }

  if (progress.moduleProgress[moduleId]) {
    progress.moduleProgress[moduleId].badgeEarned = true
    progress.moduleProgress[moduleId].completed = true
    progress.moduleProgress[moduleId].completedAt = new Date()
  }

  saveUserProgress(progress)
}

/**
 * Get learning statistics
 */
export function getLearningStats(totalModules: number, totalLessons: number): LearningStats {
  const progress = getUserProgress()

  const completedModules = Object.values(progress.moduleProgress).filter(
    (mp) => mp.completed,
  ).length

  const averageQuizScore =
    Object.values(progress.moduleProgress).reduce(
      (sum, mp) => sum + mp.bestQuizScore,
      0,
    ) / Math.max(Object.keys(progress.moduleProgress).length, 1)

  const overallProgress =
    (progress.totalLessonsCompleted / Math.max(totalLessons, 1)) * 100

  return {
    overallProgress: Math.min(overallProgress, 100),
    completedModules,
    totalModules,
    completedLessons: progress.totalLessonsCompleted,
    totalLessons,
    badgesEarned: progress.badgesEarned.length,
    totalBadges: totalModules,
    averageQuizScore,
    totalTimeSpent: progress.totalTimeSpent,
    streak: calculateStreak(progress),
    lastActiveDate: progress.lastActive,
  }
}

/**
 * Calculate learning streak (consecutive days)
 */
function calculateStreak(progress: UserProgress): number {
  // Simplified streak calculation
  // In a production app, you'd track daily activity
  const daysSinceActive = Math.floor(
    (Date.now() - progress.lastActive.getTime()) / (1000 * 60 * 60 * 24),
  )

  return daysSinceActive === 0 ? 1 : 0
}

/**
 * Reset all progress (for testing or user request)
 */
export function resetProgress(): void {
  if (typeof window === "undefined") return

  const userId = getUserId()
  const freshProgress = initializeUserProgress()
  freshProgress.userId = userId
  saveUserProgress(freshProgress)
}

/**
 * Export progress as JSON (for backup)
 */
export function exportProgress(): string {
  return JSON.stringify(getUserProgress(), null, 2)
}

/**
 * Import progress from JSON
 */
export function importProgress(jsonData: string): boolean {
  try {
    const parsed = JSON.parse(jsonData)
    saveUserProgress(parsed)
    return true
  } catch (error) {
    console.error("Error importing progress:", error)
    return false
  }
}

/**
 * Save case study response
 */
export function saveCaseStudyResponse(
  moduleId: string,
  lessonId: string,
  response: string,
): void {
  const progress = getUserProgress()

  if (!progress.caseStudyProgress) {
    progress.caseStudyProgress = {}
  }

  if (!progress.caseStudyProgress[moduleId]) {
    progress.caseStudyProgress[moduleId] = {
      moduleId,
      responses: {},
      completed: false,
    }
  }

  progress.caseStudyProgress[moduleId].responses[lessonId] = {
    lessonId,
    response,
    lastModified: new Date(),
    completedAt: new Date(),
  }

  saveUserProgress(progress)
}

/**
 * Get case study response
 */
export function getCaseStudyResponse(
  moduleId: string,
  lessonId: string,
): string {
  const progress = getUserProgress()

  if (!progress.caseStudyProgress?.[moduleId]?.responses[lessonId]) {
    return ""
  }

  return progress.caseStudyProgress[moduleId].responses[lessonId].response
}

/**
 * Get all case study responses for a module
 */
export function getAllCaseStudyResponses(
  moduleId: string,
): Record<string, string> {
  const progress = getUserProgress()

  if (!progress.caseStudyProgress?.[moduleId]) {
    return {}
  }

  const responses: Record<string, string> = {}
  for (const [lessonId, data] of Object.entries(
    progress.caseStudyProgress[moduleId].responses,
  )) {
    responses[lessonId] = data.response
  }

  return responses
}

/**
 * Check if case study module is completed
 */
export function isCaseStudyCompleted(
  moduleId: string,
  totalLessons: number,
): boolean {
  const progress = getUserProgress()

  if (!progress.caseStudyProgress?.[moduleId]) {
    return false
  }

  const responseCount = Object.keys(
    progress.caseStudyProgress[moduleId].responses,
  ).length
  return responseCount >= totalLessons
}

/**
 * Mark case study as completed
 */
export function completeCaseStudy(moduleId: string): void {
  const progress = getUserProgress()

  if (!progress.caseStudyProgress?.[moduleId]) {
    return
  }

  progress.caseStudyProgress[moduleId].completed = true
  progress.caseStudyProgress[moduleId].completedAt = new Date()

  saveUserProgress(progress)
}

/**
 * OAuth Trainer - Type Definitions
 * Core types for the learning platform
 */

export type DifficultyLevel = "beginner" | "intermediate" | "advanced" | "expert"

export type LessonContentType = "text" | "code" | "diagram" | "interactive" | "video"

export interface LessonContent {
  type: LessonContentType
  title?: string
  content?: string // optional for old module structure (some use 'code' instead)
  code?: string // optional for old module structure (use content instead)
  language?: string // for code blocks
  caption?: string
}

export interface Lesson {
  id: string
  title: string
  slug: string
  description?: string // optional for old module structure
  duration: number // in minutes
  order?: number // optional for old module structure
  content?: LessonContent[] // optional for MDX lessons
  keyTakeaways?: string[] // optional for MDX lessons
  prerequisites?: string[] // lesson IDs
  quiz?: Quiz | QuizQuestion[] // optional for old module structure (deprecated)
}

export interface QuizQuestion {
  id?: string // optional for old module structure
  question: string
  options: string[]
  correctAnswer: number // index of correct option
  explanation: string
  difficulty?: DifficultyLevel // optional for old module structure
  relatedLessonId?: string // optional for old module structure
}

export interface Quiz {
  id?: string // optional for old module structure (can be inferred from parent)
  moduleId?: string // optional for old module structure (can be inferred from parent)
  title?: string // optional for old module structure
  description?: string // optional for old module structure
  questions: QuizQuestion[]
  passingScore: number // percentage (e.g., 80)
  timeLimit?: number // in minutes, optional
}

export interface Module {
  id: string
  title: string
  slug: string
  description: string
  icon?: string // optional for old module structure
  difficulty: DifficultyLevel
  order?: number // optional for old module structure
  estimatedHours: number
  prerequisiteModules?: string[] // module IDs for old structure
  lessons: Lesson[]
  quiz?: Quiz | QuizQuestion[] // optional for old module structure (some modules may not have quizzes yet, or quiz might be array)
  prerequisites?: string[] // module IDs
  badge: Badge
  learningObjectives?: string[] // optional for old module structure
  isMigrated?: boolean // indicates if module has been migrated to MDX format
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string // emoji or icon name
  color?: string // optional for old module structure - CSS color value
  moduleId?: string // optional for old module structure (can be inferred from parent)
}

export interface LessonProgress {
  lessonId: string
  completed: boolean
  completedAt?: Date
  timeSpent: number // in minutes
}

export interface QuizAttempt {
  quizId: string
  attemptNumber: number
  score: number // percentage
  correctAnswers: number
  totalQuestions: number
  answers: Record<string, number> // questionId -> selected option index
  completedAt: Date
  passed: boolean
}

export interface ModuleProgress {
  moduleId: string
  started: boolean
  startedAt?: Date
  completed: boolean
  completedAt?: Date
  lessonProgress: Record<string, LessonProgress>
  quizAttempts: QuizAttempt[]
  bestQuizScore: number
  badgeEarned: boolean
  totalTimeSpent: number // in minutes
}

export interface UserProgress {
  userId: string // generated client-side
  createdAt: Date
  lastActive: Date
  moduleProgress: Record<string, ModuleProgress>
  caseStudyProgress?: Record<string, CaseStudyProgress> // moduleId -> case study progress
  totalLessonsCompleted: number
  totalQuizzesPassed: number
  totalTimeSpent: number
  badgesEarned: string[] // badge IDs
  currentModuleId?: string
  currentLessonId?: string
}

export interface LearningStats {
  overallProgress: number // percentage
  completedModules: number
  totalModules: number
  completedLessons: number
  totalLessons: number
  badgesEarned: number
  totalBadges: number
  averageQuizScore: number
  totalTimeSpent: number
  streak: number // consecutive days of learning
  lastActiveDate: Date
}

// Case Study types
export interface CaseStudyResponse {
  lessonId: string
  response: string
  completedAt?: Date
  lastModified: Date
}

export interface CaseStudyProgress {
  moduleId: string
  responses: Record<string, CaseStudyResponse> // lessonId -> response
  completed: boolean
  completedAt?: Date
}

// Helper types for UI components
export interface ModuleCardProps {
  module: Module
  progress?: ModuleProgress
  locked?: boolean
}

export interface LessonCardProps {
  lesson: Lesson
  progress?: LessonProgress
  moduleSlug: string
}

export interface QuizCardProps {
  quiz: Quiz
  attempts: QuizAttempt[]
  moduleSlug: string
}

export interface BadgeCardProps {
  badge: Badge
  earned: boolean
  earnedAt?: Date
}

// Content organization
export interface CourseStructure {
  modules: Module[]
  totalLessons: number
  totalDuration: number
}

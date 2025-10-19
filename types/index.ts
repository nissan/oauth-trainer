/**
 * OAuth Trainer - Type Definitions
 * Core types for the learning platform
 */

export type DifficultyLevel = "beginner" | "intermediate" | "expert"

export type LessonContentType = "text" | "code" | "diagram" | "interactive" | "video"

export interface LessonContent {
  type: LessonContentType
  title?: string
  content: string
  language?: string // for code blocks
  caption?: string
}

export interface Lesson {
  id: string
  title: string
  slug: string
  description: string
  duration: number // in minutes
  order: number
  content?: LessonContent[] // optional for MDX lessons
  keyTakeaways?: string[] // optional for MDX lessons
  prerequisites?: string[] // lesson IDs
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number // index of correct option
  explanation: string
  difficulty: DifficultyLevel
  relatedLessonId: string
}

export interface Quiz {
  id: string
  moduleId: string
  questions: QuizQuestion[]
  passingScore: number // percentage (e.g., 80)
  timeLimit?: number // in minutes, optional
}

export interface Module {
  id: string
  title: string
  slug: string
  description: string
  difficulty: DifficultyLevel
  order: number
  estimatedHours: number
  lessons: Lesson[]
  quiz: Quiz
  prerequisites?: string[] // module IDs
  badge: Badge
  learningObjectives: string[]
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string // emoji or icon name
  color: string // CSS color value
  moduleId: string
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

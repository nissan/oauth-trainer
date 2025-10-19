"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ModuleCard } from "@/components/module-card"
import { ModeToggle } from "@/components/mode-toggle"
import { modules as oldModules } from "@/data/modules"
import { getAllModules } from "@/lib/content"
import { getUserProgress, getLearningStats } from "@/lib/storage"
import type { UserProgress, Module } from "@/types"

export default function Home() {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const progress = getUserProgress()
    setUserProgress(progress)
  }, [])

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  // Combine MDX and old TypeScript modules
  const mdxModules = getAllModules()
  const mdxModuleSlugs = new Set(mdxModules.map(m => m.metadata.slug))

  // Convert MDX modules to the Module type expected by the UI
  const convertedMdxModules: Module[] = mdxModules.map(m => ({
    id: m.metadata.id,
    title: m.metadata.title,
    slug: m.metadata.slug,
    description: m.metadata.description,
    difficulty: m.metadata.difficulty,
    estimatedHours: m.metadata.estimatedHours,
    badge: m.metadata.badge,
    learningObjectives: m.metadata.learningObjectives,
    prerequisiteModules: m.metadata.prerequisiteModules,
    order: m.metadata.order,
    lessons: m.lessons.map(lesson => ({
      id: lesson.frontmatter.slug,
      slug: lesson.slug,
      title: lesson.frontmatter.title,
      description: lesson.frontmatter.description,
      duration: lesson.frontmatter.duration,
      order: lesson.frontmatter.order,
      keyTakeaways: lesson.frontmatter.keyTakeaways,
      prerequisites: lesson.frontmatter.prerequisites,
      content: [] // Content is loaded separately for MDX
    })),
    quiz: m.quiz
  }))

  // Only include old modules that don't have MDX versions
  const filteredOldModules = oldModules.filter(m => !mdxModuleSlugs.has(m.slug))

  // Combine and sort by order
  const modules = [...convertedMdxModules, ...filteredOldModules].sort((a, b) => (a.order || 0) - (b.order || 0))

  const hasStarted = userProgress && Object.keys(userProgress.moduleProgress).length > 0
  const stats = getLearningStats(modules.length, modules.reduce((sum, m) => sum + m.lessons.length, 0))

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl">🔐</div>
            <span className="text-lg font-bold">ReddiTech's Curious Auth Builder</span>
          </Link>
          <nav className="flex items-center gap-4" aria-label="Main navigation">
            {hasStarted && (
              <Link href="/progress">
                <Button variant="outline">My Progress</Button>
              </Link>
            )}
            <Link href="/references">
              <Button variant="ghost" size="sm">References</Button>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
            Master Identity & Access Management
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Become an expert in OAuth 2.0, OpenID Connect, SAML, FIDO2, and modern authentication.
            Comprehensive lessons with hands-on quizzes to certify your knowledge.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/learn">
              <Button size="lg" className="text-lg">
                {hasStarted ? "Continue Learning" : "Start Learning"}
              </Button>
            </Link>
            <Link href="/progress">
              <Button size="lg" variant="outline" className="text-lg">
                {hasStarted ? "View Progress" : "Learn More"}
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress Overview (if user has started) */}
        {hasStarted && stats.completedLessons > 0 && (
          <Card className="mx-auto mt-12 max-w-3xl border-accent/50 bg-accent/5">
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Your Progress</h2>
                <span className="text-3xl font-bold text-primary">
                  {Math.round(stats.overallProgress)}%
                </span>
              </div>
              <Progress value={stats.overallProgress} className="mb-4 h-3" />
              <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
                <div>
                  <div className="text-2xl font-bold">{stats.completedModules}</div>
                  <div className="text-sm text-muted-foreground">Modules Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.completedLessons}</div>
                  <div className="text-sm text-muted-foreground">Lessons Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.badgesEarned}</div>
                  <div className="text-sm text-muted-foreground">Badges Earned</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{Math.round(stats.totalTimeSpent / 60)}h</div>
                  <div className="text-sm text-muted-foreground">Time Invested</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Learning Path */}
        <div className="mt-16">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold">Your Learning Path</h2>
            <p className="text-muted-foreground">
              Progress from beginner to expert through {modules.length} comprehensive modules
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => {
              const moduleProgress = userProgress?.moduleProgress[module.id]

              return (
                <ModuleCard
                  key={module.id}
                  module={module}
                  progress={moduleProgress}
                  locked={false}
                />
              )
            })}
          </div>
        </div>

        {/* Features */}
        <div className="mx-auto mt-24 max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold">What You'll Learn</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 text-4xl">🎯</div>
                <h3 className="mb-2 text-xl font-semibold">Expert-Level Content</h3>
                <p className="text-sm text-muted-foreground">
                  From fundamentals to advanced topics like Zanzibar and Zero Trust architecture
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 text-4xl">📚</div>
                <h3 className="mb-2 text-xl font-semibold">Comprehensive Lessons</h3>
                <p className="text-sm text-muted-foreground">
                  {modules.reduce((sum, m) => sum + m.lessons.length, 0)}+ lessons covering OAuth 2.0, OIDC, SAML, FIDO2, Web3 Auth, and modern IAM
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 text-4xl">✅</div>
                <h3 className="mb-2 text-xl font-semibold">Certification Quizzes</h3>
                <p className="text-sm text-muted-foreground">
                  Test your knowledge with multiple-choice quizzes after each module
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 text-4xl">💾</div>
                <h3 className="mb-2 text-xl font-semibold">Progress Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Your progress is saved locally. Pick up where you left off anytime
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 text-4xl">🏆</div>
                <h3 className="mb-2 text-xl font-semibold">Earn Badges</h3>
                <p className="text-sm text-muted-foreground">
                  Collect achievement badges as you master each module
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 text-4xl">🔓</div>
                <h3 className="mb-2 text-xl font-semibold">No Registration</h3>
                <p className="text-sm text-muted-foreground">
                  Start learning immediately. Anonymous and privacy-focused
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="mx-auto mt-24 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to become an IAM expert?</h2>
          <p className="mb-8 text-muted-foreground">
            Start your journey today and master the skills that power secure modern applications
          </p>
          <Link href="/learn">
            <Button size="lg" className="text-lg">
              Begin Your Journey
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built with Claude Code • View{" "}
            <Link href="/references" className="underline hover:text-foreground">
              references and attributions
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}

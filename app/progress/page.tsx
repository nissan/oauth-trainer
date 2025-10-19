"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BadgeDisplay } from "@/components/badge-display"
import { ModeToggle } from "@/components/mode-toggle"
import { modules } from "@/data/modules"
import { getUserProgress, getLearningStats, resetProgress } from "@/lib/storage"
import type { UserProgress } from "@/types"

export default function ProgressPage() {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [mounted, setMounted] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  useEffect(() => {
    setMounted(true)
    const progress = getUserProgress()
    setUserProgress(progress)
  }, [])

  if (!mounted) {
    return null
  }

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0)
  const stats = getLearningStats(modules.length, totalLessons)

  const handleReset = () => {
    if (showResetConfirm) {
      resetProgress()
      const progress = getUserProgress()
      setUserProgress(progress)
      setShowResetConfirm(false)
    } else {
      setShowResetConfirm(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl">🔐</div>
            <span className="text-lg font-bold">ReddiTech's Curious Auth Builder</span>
          </Link>
          <nav className="flex items-center gap-4" aria-label="Main navigation">
            <Link href="/learn">
              <Button variant="outline">Learning Hub</Button>
            </Link>
            <Link href="/references">
              <Button variant="ghost" size="sm">
                References
              </Button>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Your Learning Progress</h1>
          <p className="text-lg text-muted-foreground">
            Track your journey to becoming an IAM expert
          </p>
        </div>

        {/* Overall Stats */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-3xl font-bold">
                {Math.round(stats.overallProgress)}%
              </div>
              <Progress value={stats.overallProgress} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Modules Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.completedModules} / {stats.totalModules}
              </div>
              <p className="text-sm text-muted-foreground">
                {stats.totalModules - stats.completedModules} remaining
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Lessons Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.completedLessons} / {stats.totalLessons}
              </div>
              <p className="text-sm text-muted-foreground">
                {stats.totalLessons - stats.completedLessons} remaining
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Time Invested
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.round(stats.totalTimeSpent / 60)}h
              </div>
              <p className="text-sm text-muted-foreground">
                ~{Math.round(stats.totalTimeSpent)} minutes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Badges Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Achievement Badges</h2>
          <p className="mb-6 text-muted-foreground">
            Earn badges by completing modules with quiz scores of 80% or higher.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {modules.map((module) => {
              const moduleProgress = userProgress?.moduleProgress[module.id]
              const badgeEarned = moduleProgress?.badgeEarned || false
              const earnedAt = moduleProgress?.completedAt

              return (
                <BadgeDisplay
                  key={module.id}
                  badge={module.badge}
                  earned={badgeEarned}
                  earnedAt={earnedAt}
                />
              )
            })}
          </div>
        </div>

        {/* Module Progress Details */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Module Details</h2>

          <div className="space-y-4">
            {modules.map((module) => {
              const moduleProgress = userProgress?.moduleProgress[module.id]
              const completedLessons = moduleProgress
                ? Object.values(moduleProgress.lessonProgress).filter((lp) => lp.completed)
                    .length
                : 0
              const totalLessons = module.lessons.length
              const progressPercent =
                totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

              return (
                <Card key={module.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <span>{module.badge.icon}</span>
                          {module.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {completedLessons} of {totalLessons} lessons completed
                        </CardDescription>
                      </div>
                      {moduleProgress?.badgeEarned && (
                        <div className="text-4xl">{module.badge.icon}</div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={progressPercent} className="mb-4 h-2" />

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Progress: </span>
                        <span className="font-medium">
                          {Math.round(progressPercent)}%
                        </span>
                      </div>

                      {moduleProgress?.quizAttempts &&
                        moduleProgress.quizAttempts.length > 0 && (
                          <div>
                            <span className="text-muted-foreground">Best Quiz Score: </span>
                            <span className="font-medium">
                              {Math.round(moduleProgress.bestQuizScore)}%
                            </span>
                          </div>
                        )}

                      {(moduleProgress?.totalTimeSpent ?? 0) > 0 && (
                        <div>
                          <span className="text-muted-foreground">Time Spent: </span>
                          <span className="font-medium">
                            {Math.round(moduleProgress.totalTimeSpent ?? 0)} min
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <Link href={`/learn/${module.slug}`}>
                        <Button
                          variant={moduleProgress?.started ? "secondary" : "default"}
                          size="sm"
                        >
                          {moduleProgress?.completed
                            ? "Review Module"
                            : moduleProgress?.started
                              ? "Continue"
                              : "Start Module"}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle>Manage Progress</CardTitle>
            <CardDescription>
              Export your progress or start fresh with a new learning journey.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                const progress = getUserProgress()
                const dataStr = JSON.stringify(progress, null, 2)
                const dataUri =
                  "data:application/json;charset=utf-8," +
                  encodeURIComponent(dataStr)
                const exportFileDefaultName = `oauth-trainer-progress-${Date.now()}.json`

                const linkElement = document.createElement("a")
                linkElement.setAttribute("href", dataUri)
                linkElement.setAttribute("download", exportFileDefaultName)
                linkElement.click()
              }}
            >
              Export Progress
            </Button>

            <Button
              variant={showResetConfirm ? "destructive" : "outline"}
              onClick={handleReset}
            >
              {showResetConfirm ? "Confirm Reset?" : "Reset All Progress"}
            </Button>

            {showResetConfirm && (
              <Button variant="ghost" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </Button>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

"use client"

import Link from "next/link"
import type { Module, ModuleProgress } from "@/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

interface ModuleCardProps {
  module: Module
  progress?: ModuleProgress
  locked?: boolean
}

export function ModuleCard({ module, progress, locked = false }: ModuleCardProps) {
  const completedLessons = progress
    ? Object.values(progress.lessonProgress).filter((lp) => lp.completed).length
    : 0
  const totalLessons = module.lessons.length
  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  const difficultyColors = {
    beginner: "beginner",
    intermediate: "intermediate",
    expert: "expert",
  } as const

  const difficultyVariant = difficultyColors[module.difficulty]

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
      {locked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">🔒 Locked</p>
            <p className="text-xs text-muted-foreground">
              Complete previous modules to unlock
            </p>
          </div>
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant={difficultyVariant}>{module.difficulty}</Badge>
              {progress?.badgeEarned && <span className="text-lg">{module.badge.icon}</span>}
            </div>
            <CardTitle className="text-xl">{module.title}</CardTitle>
          </div>
          <div className="text-2xl">{module.badge.icon}</div>
        </div>
        <CardDescription className="line-clamp-2">{module.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}
          </span>
          <span className="text-muted-foreground">~{module.estimatedHours}h</span>
        </div>

        {progress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-muted-foreground">
                {completedLessons}/{totalLessons}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        {progress?.completed && (
          <div className="flex items-center gap-2 rounded-md bg-success/10 px-3 py-2">
            <span className="text-sm font-medium text-success-foreground">
              ✓ Completed • Best quiz score: {Math.round(progress.bestQuizScore)}%
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Link href={`/learn/${module.slug}`} className="w-full">
          <Button
            variant={progress?.started ? "secondary" : "default"}
            className="w-full"
            disabled={locked}
          >
            {progress?.completed
              ? "Review Module"
              : progress?.started
                ? "Continue Learning"
                : "Start Module"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

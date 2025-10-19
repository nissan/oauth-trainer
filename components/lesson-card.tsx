"use client"

import Link from "next/link"
import type { Lesson, LessonProgress } from "@/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface LessonCardProps {
  lesson: Lesson
  progress?: LessonProgress
  moduleSlug: string
}

export function LessonCard({ lesson, progress, moduleSlug }: LessonCardProps) {
  const isCompleted = progress?.completed || false

  return (
    <Link href={`/learn/${moduleSlug}/${lesson.slug}`}>
      <Card
        className={`group cursor-pointer transition-all hover:shadow-md ${
          isCompleted ? "border-success/50 bg-success/5" : ""
        }`}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-base group-hover:text-primary">
                {isCompleted && <span className="text-success">✓</span>}
                <span>Lesson {lesson.order}: {lesson.title}</span>
              </CardTitle>
              <CardDescription className="mt-1 line-clamp-2">
                {lesson.description}
              </CardDescription>
            </div>
            <div className="text-xs text-muted-foreground">{lesson.duration} min</div>
          </div>
        </CardHeader>

        {isCompleted && progress && (
          <CardContent className="pt-0">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Completed {new Date(progress.completedAt!).toLocaleDateString()}</span>
              <span>•</span>
              <span>{progress.timeSpent} min spent</span>
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  )
}

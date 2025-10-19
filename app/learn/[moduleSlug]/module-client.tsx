"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LessonCard } from "@/components/lesson-card";
import { PasswordGate } from "@/components/password-gate";
import { getUserProgress } from "@/lib/storage";
import type { UserProgress } from "@/types";
import type { ModuleMetadata } from "@/lib/content-types";

interface Lesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: number;
  order: number;
}

interface Quiz {
  questions: unknown[];
  passingScore: number;
}

interface ModuleClientProps {
  moduleSlug: string;
  metadata: ModuleMetadata;
  lessons: Lesson[];
  quiz: Quiz;
  moduleIndex: number;
  totalModules: number;
  prerequisiteModules: Array<{
    id: string;
    slug: string;
    title: string;
  }>;
}

export function ModuleClient({
  moduleSlug,
  metadata,
  lessons,
  quiz,
  moduleIndex,
  totalModules,
  prerequisiteModules,
}: ModuleClientProps) {
  const router = useRouter();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const progress = getUserProgress();
    setUserProgress(progress);
  }, []);

  if (!mounted) {
    return null;
  }

  const moduleProgress = userProgress?.moduleProgress[metadata.id];
  const completedLessons = moduleProgress
    ? Object.values(moduleProgress.lessonProgress).filter((lp) => lp.completed)
        .length
    : 0;
  const totalLessons = lessons.length;
  const progressPercent =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Check for incomplete prerequisites
  const incompletePrerequisites = prerequisiteModules.filter(
    (prereqModule) => !userProgress?.moduleProgress[prereqModule.id]?.completed
  );

  const difficultyColors = {
    beginner: "beginner",
    intermediate: "intermediate",
    expert: "expert",
    advanced: "expert", // map advanced to expert styling
  } as const;

  const firstIncompleteLesson = lessons.find((lesson) => {
    const lessonProgress = moduleProgress?.lessonProgress[lesson.id];
    return !lessonProgress?.completed;
  });

  const nextLessonSlug = firstIncompleteLesson
    ? firstIncompleteLesson.slug
    : lessons[0]?.slug;

  const moduleContent = (
    <>
      {incompletePrerequisites.length > 0 && (
        <Card className="mb-6 border-warning/50 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <span className="text-4xl">💡</span>
              <div className="flex-1">
                <h3 className="mb-2 font-semibold">
                  Recommended Prerequisites
                </h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  For the best learning experience, we recommend completing
                  these modules first:
                </p>
                <ul className="space-y-2">
                  {incompletePrerequisites.map((prereqModule) => (
                    <li
                      key={prereqModule.id}
                      className="flex items-center gap-2"
                    >
                      <span className="text-muted-foreground">→</span>
                      <Link
                        href={`/learn/${prereqModule.slug}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {prereqModule.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-muted-foreground">
                  You can still proceed with this module, but some concepts may
                  be easier to understand with prerequisite knowledge.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Module Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Badge variant={difficultyColors[metadata.difficulty]}>
            {metadata.difficulty}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Module {moduleIndex + 1} of {totalModules}
          </span>
        </div>

        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="mb-2 text-4xl font-bold">{metadata.title}</h1>
            <p className="text-lg text-muted-foreground">
              {metadata.description}
            </p>
          </div>
          <div className="text-6xl">{metadata.badge.icon}</div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>📚 {totalLessons} lessons</span>
          <span>⏱️ ~{metadata.estimatedHours} hours</span>
          {moduleProgress?.completed && (
            <span className="text-success">
              ✓ Completed • Best score:{" "}
              {Math.round(moduleProgress.bestQuizScore)}%
            </span>
          )}
        </div>
      </div>

      {/* Progress Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {completedLessons} of {totalLessons} lessons completed
            </span>
            <span className="text-2xl font-bold">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <Progress value={progressPercent} className="mb-4 h-3" />

          {nextLessonSlug && (
            <Link href={`/learn/${moduleSlug}/${nextLessonSlug}`}>
              <Button className="w-full" size="lg">
                {completedLessons === 0
                  ? "Start First Lesson"
                  : completedLessons === totalLessons
                    ? "Review Lessons"
                    : "Continue Learning"}
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Learning Objectives */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Learning Objectives</CardTitle>
          <CardDescription>
            By completing this module, you will be able to:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {metadata.learningObjectives.map((objective, index) => (
              <li key={index} className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Lessons */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Lessons</h2>
        <div className="space-y-4">
          {lessons.map((lesson) => {
            const lessonProgress =
              moduleProgress?.lessonProgress[lesson.id];
            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                progress={lessonProgress}
                moduleSlug={moduleSlug}
              />
            );
          })}
        </div>
      </div>

      {/* Quiz Card */}
      <Card className="border-accent/50 bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📝</span>
            Module Quiz
          </CardTitle>
          <CardDescription>
            Test your knowledge with {quiz.questions.length} questions. Pass
            with {quiz.passingScore}% or higher to earn your badge.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {moduleProgress?.quizAttempts &&
            moduleProgress.quizAttempts.length > 0 && (
              <div className="mb-4 rounded-md bg-background/50 p-4">
                <div className="text-sm font-medium">Previous Attempts</div>
                <div className="mt-2 space-y-2">
                  {moduleProgress.quizAttempts.slice(-3).map((attempt, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        Attempt {attempt.attemptNumber}
                      </span>
                      <span
                        className={
                          attempt.passed ? "text-success" : "text-destructive"
                        }
                      >
                        {Math.round(attempt.score)}% {attempt.passed && "✓"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          <Link href={`/learn/${moduleSlug}/quiz`}>
            <Button
              variant={moduleProgress?.completed ? "secondary" : "default"}
              className="w-full"
            >
              {moduleProgress?.completed ? "Retake Quiz" : "Take Quiz"}
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Badge Preview */}
      {moduleProgress?.badgeEarned && (
        <Card className="mt-8 border-success/50 bg-success/5">
          <CardContent className="flex items-center gap-4 pt-6">
            <span className="text-6xl">{metadata.badge.icon}</span>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{metadata.badge.name}</h3>
              <p className="text-sm text-muted-foreground">
                {metadata.badge.description}
              </p>
            </div>
            <Badge variant="success" className="text-lg">
              Earned
            </Badge>
          </CardContent>
        </Card>
      )}
    </>
  );

  // Wrap content with password gate if required
  if (metadata.requiresPassword && metadata.password) {
    return (
      <PasswordGate password={metadata.password} moduleId={metadata.id}>
        {moduleContent}
      </PasswordGate>
    );
  }

  return moduleContent;
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LessonContentRenderer } from "@/components/lesson-content-renderer";
import { ModeToggle } from "@/components/mode-toggle";
import {
  getLessonBySlug,
  getNextLesson,
  getPreviousLesson,
} from "@/data/modules";
import { getUserProgress, completeLesson } from "@/lib/storage";
import type { UserProgress } from "@/types";

export default function LessonClientOld() {
  const params = useParams();
  const router = useRouter();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [mounted, setMounted] = useState(false);
  const [lessonStartTime, setLessonStartTime] = useState<number>(Date.now());

  const moduleSlug = params.moduleSlug as string;
  const lessonSlug = params.lessonSlug as string;

  const lesson = getLessonBySlug(moduleSlug, lessonSlug);
  const nextLesson = getNextLesson(moduleSlug, lessonSlug);
  const previousLesson = getPreviousLesson(moduleSlug, lessonSlug);

  useEffect(() => {
    setMounted(true);
    const progress = getUserProgress();
    setUserProgress(progress);
    setLessonStartTime(Date.now());
  }, [lessonSlug]);

  if (!mounted) {
    return null;
  }

  if (!lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Lesson Not Found</h1>
          <Link href="/learn">
            <Button>Back to Learning Hub</Button>
          </Link>
        </div>
      </div>
    );
  }

  const lessonProgress =
    userProgress?.moduleProgress[lesson.id]?.lessonProgress[lesson.id];
  const isCompleted = lessonProgress?.completed || false;

  const handleCompleteLesson = () => {
    const timeSpent = Math.round((Date.now() - lessonStartTime) / 1000 / 60); // minutes
    completeLesson(moduleSlug, lesson.id, timeSpent);
    const updatedProgress = getUserProgress();
    setUserProgress(updatedProgress);
  };

  const handleNext = () => {
    if (!isCompleted) {
      handleCompleteLesson();
    }
    if (nextLesson) {
      router.push(`/learn/${nextLesson.module.slug}/${nextLesson.lesson.slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl">🔐</div>
            <span className="hidden text-lg font-bold sm:inline">
              ReddiTech's Curious Auth Builder
            </span>
          </Link>
          <nav
            className="flex items-center gap-2 sm:gap-4"
            aria-label="Main navigation"
          >
            <Link href={`/learn/${moduleSlug}`}>
              <Button variant="ghost" size="sm">
                ← Module
              </Button>
            </Link>
            <Link href="/progress">
              <Button variant="outline" size="sm">
                Progress
              </Button>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/learn" className="hover:text-foreground">
            Learning Hub
          </Link>
          <span>/</span>
          <Link href={`/learn/${moduleSlug}`} className="hover:text-foreground">
            {moduleSlug}
          </Link>
          <span>/</span>
          <span className="text-foreground">Lesson {lesson.order}</span>
        </div>

        {/* Lesson Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="outline">Lesson {lesson.order}</Badge>
            <span className="text-sm text-muted-foreground">
              ⏱️ {lesson.duration} min
            </span>
            {isCompleted && (
              <Badge variant="success" className="ml-auto">
                ✓ Completed
              </Badge>
            )}
          </div>

          <h1 className="mb-4 text-4xl font-bold">{lesson.title}</h1>
          <p className="text-lg text-muted-foreground">{lesson.description}</p>
        </div>

        {/* Lesson Content */}
        <div className="mb-12">
          <LessonContentRenderer content={lesson.content} />
        </div>

        {/* Key Takeaways */}
        <Card className="mb-8 border-success/30 bg-success/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>💡</span>
              Key Takeaways
            </CardTitle>
            <CardDescription>Remember these important points:</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {lesson.keyTakeaways.map((takeaway, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-success">✓</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {previousLesson && (
              <Link
                href={`/learn/${previousLesson.module.slug}/${previousLesson.lesson.slug}`}
              >
                <Button variant="outline">
                  ← Previous: {previousLesson.lesson.title}
                </Button>
              </Link>
            )}
          </div>

          <div className="flex gap-2">
            {!isCompleted && (
              <Button variant="secondary" onClick={handleCompleteLesson}>
                Mark as Complete
              </Button>
            )}

            {nextLesson ? (
              <Button onClick={handleNext}>
                Next: {nextLesson.lesson.title} →
              </Button>
            ) : (
              <Link href={`/learn/${moduleSlug}/quiz`}>
                <Button>Take Module Quiz →</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Prerequisites Info */}
        {lesson.prerequisites && lesson.prerequisites.length > 0 && (
          <Card className="mt-8 border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-base">Prerequisites</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This lesson builds on concepts from previous lessons. Make sure
                you've completed them first.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

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
import { ShareLesson } from "@/components/share-lesson";
import { getUserProgress, completeLesson } from "@/lib/storage";
import type { UserProgress } from "@/types";

interface LessonClientProps {
  moduleSlug: string;
  lessonSlug: string;
  lessonId: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  keyTakeaways: string[];
  prerequisites?: string[];
  nextLesson: { moduleSlug: string; lessonSlug: string } | null;
  previousLesson: { moduleSlug: string; lessonSlug: string } | null;
  children: React.ReactNode;
}

export function LessonClient({
  moduleSlug,
  lessonSlug,
  lessonId,
  title,
  description,
  order,
  duration,
  keyTakeaways,
  prerequisites,
  nextLesson,
  previousLesson,
  children,
}: LessonClientProps) {
  const router = useRouter();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [mounted, setMounted] = useState(false);
  const [lessonStartTime, setLessonStartTime] = useState<number>(Date.now());

  useEffect(() => {
    setMounted(true);
    const progress = getUserProgress();
    setUserProgress(progress);
    setLessonStartTime(Date.now());
  }, [lessonSlug]);

  if (!mounted) {
    return null;
  }

  const lessonProgress =
    userProgress?.moduleProgress[moduleSlug]?.lessonProgress[lessonId];
  const isCompleted = lessonProgress?.completed || false;

  const handleCompleteLesson = () => {
    const timeSpent = Math.round((Date.now() - lessonStartTime) / 1000 / 60); // minutes
    completeLesson(moduleSlug, lessonId, timeSpent);
    const updatedProgress = getUserProgress();
    setUserProgress(updatedProgress);
  };

  const handleNext = () => {
    if (!isCompleted) {
      handleCompleteLesson();
    }
    if (nextLesson) {
      router.push(`/learn/${nextLesson.moduleSlug}/${nextLesson.lessonSlug}`);
    }
  };

  return (
    <>
      {/* Lesson Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Badge variant="outline">Lesson {order}</Badge>
          <span className="text-sm text-muted-foreground">⏱️ {duration} min</span>
          {isCompleted && (
            <Badge variant="success" className="ml-auto">
              ✓ Completed
            </Badge>
          )}
        </div>

        <h1 className="mb-4 text-4xl font-bold">{title}</h1>
        <p className="text-lg text-muted-foreground mb-4">{description}</p>

        {/* Share Button */}
        <div className="flex items-center gap-2">
          <ShareLesson
            title={title}
            moduleTitle={`Module ${moduleSlug.split('-')[0]}`}
          />
        </div>
      </div>

      {/* Lesson Content (MDX) */}
      <div className="mb-12">{children}</div>

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
            {keyTakeaways.map((takeaway, index) => (
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
              href={`/learn/${previousLesson.moduleSlug}/${previousLesson.lessonSlug}`}
            >
              <Button variant="outline">
                ← Previous Lesson
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
              Next Lesson →
            </Button>
          ) : (
            <Link href={`/learn/${moduleSlug}/quiz`}>
              <Button>Take Module Quiz →</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Prerequisites Info */}
      {prerequisites && prerequisites.length > 0 && (
        <Card className="mt-8 border-accent/30 bg-accent/5">
          <CardHeader>
            <CardTitle className="text-base">Prerequisites</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This lesson builds on concepts from previous lessons. Make sure you've
              completed them first.
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
}

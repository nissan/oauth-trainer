import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  getLesson,
  getNextLesson,
  getPreviousLesson,
  getModuleSlugs,
  getLessonSlugs,
} from "@/lib/content";
import { getLessonBySlug } from "@/data/modules";
import { LessonClient } from "./lesson-client";
import { notFound } from "next/navigation";
import { MDXContent } from "./mdx-content";

interface PageProps {
  params: Promise<{
    moduleSlug: string;
    lessonSlug: string;
  }>;
}

// Generate static params for all lessons
export async function generateStaticParams() {
  const params: { moduleSlug: string; lessonSlug: string }[] = [];

  // Get MDX-based lessons
  const moduleSlugs = getModuleSlugs();
  for (const moduleSlug of moduleSlugs) {
    const lessonSlugs = getLessonSlugs(moduleSlug);
    for (const lessonSlug of lessonSlugs) {
      params.push({ moduleSlug, lessonSlug });
    }
  }

  return params;
}

export default async function LessonPage({ params }: PageProps) {
  const { moduleSlug, lessonSlug } = await params;

  // Try to load MDX content first
  const mdxLesson = getLesson(moduleSlug, lessonSlug);

  // Fallback to old TypeScript-based content
  const oldLesson = !mdxLesson ? getLessonBySlug(moduleSlug, lessonSlug) : null;

  // If neither exists, show 404
  if (!mdxLesson && !oldLesson) {
    notFound();
  }

  // Use MDX if available, otherwise use old format
  if (mdxLesson) {
    // MDX-based lesson
    const frontmatter = mdxLesson.frontmatter;
    const nextLesson = getNextLesson(moduleSlug, lessonSlug);
    const previousLesson = getPreviousLesson(moduleSlug, lessonSlug);

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
            <Link
              href={`/learn/${moduleSlug}`}
              className="hover:text-foreground"
            >
              {moduleSlug}
            </Link>
            <span>/</span>
            <span className="text-foreground">Lesson {frontmatter.order}</span>
          </div>

          {/* Pass data to client component for progress tracking */}
          <LessonClient
            moduleSlug={moduleSlug}
            lessonSlug={lessonSlug}
            lessonId={frontmatter.slug}
            title={frontmatter.title}
            description={frontmatter.description}
            order={frontmatter.order}
            duration={frontmatter.duration}
            keyTakeaways={frontmatter.keyTakeaways}
            prerequisites={frontmatter.prerequisites}
            nextLesson={nextLesson}
            previousLesson={previousLesson}
          >
            <MDXContent moduleSlug={moduleSlug} lessonSlug={lessonSlug} />
          </LessonClient>
        </main>
      </div>
    );
  }

  // No lesson found
  return notFound();
}

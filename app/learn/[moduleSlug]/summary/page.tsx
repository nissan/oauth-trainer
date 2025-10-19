import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { getModule, getModuleMetadata } from "@/lib/content";
import { notFound } from "next/navigation";
import { SummaryClient } from "./summary-client";

interface PageProps {
  params: Promise<{
    moduleSlug: string;
  }>;
}

export default async function SummaryPage({ params }: PageProps) {
  const { moduleSlug } = await params;

  // Load MDX module
  const mdxModule = getModule(moduleSlug);
  const mdxModuleMetadata = getModuleMetadata(moduleSlug);

  // If module doesn't exist, show 404
  if (!mdxModule || !mdxModuleMetadata) {
    notFound();
  }

  // Extract lesson info for summary
  const lessons = mdxModule.lessons.map((lesson) => ({
    id: lesson.frontmatter.slug,
    slug: lesson.slug,
    title: lesson.frontmatter.title,
    description: lesson.frontmatter.description,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl">🔐</div>
            <span className="text-lg font-bold">
              ReddiTech's Curious Auth Builder
            </span>
          </Link>
          <nav
            className="flex items-center gap-4"
            aria-label="Main navigation"
          >
            <Link href="/learn">
              <Button variant="ghost">← Learning Hub</Button>
            </Link>
            <Link href={`/learn/${moduleSlug}`}>
              <Button variant="outline">← Module Overview</Button>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <SummaryClient
          moduleSlug={moduleSlug}
          moduleId={mdxModuleMetadata.id}
          moduleTitle={mdxModuleMetadata.title}
          lessons={lessons}
        />
      </main>
    </div>
  );
}

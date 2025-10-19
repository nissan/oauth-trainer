import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  getModule,
  getModuleSlugs,
  getAllModules,
  getModuleMetadata,
} from "@/lib/content";
import { getModuleBySlug, modules } from "@/data/modules";
import { ModuleClient } from "./module-client";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    moduleSlug: string;
  }>;
}

// Generate static params for all modules
export async function generateStaticParams() {
  // Get MDX-based modules
  const mdxModuleSlugs = getModuleSlugs();

  // Get old TypeScript-based modules
  const oldModuleSlugs = modules.map((m) => ({ moduleSlug: m.slug }));

  // Combine both (MDX takes priority)
  const allSlugs = new Set([
    ...mdxModuleSlugs.map((slug) => ({ moduleSlug: slug })),
    ...oldModuleSlugs,
  ]);

  return Array.from(allSlugs);
}

export default async function ModulePage({ params }: PageProps) {
  const { moduleSlug } = await params;

  // Try to load MDX module first
  const mdxModule = getModule(moduleSlug);
  const mdxModuleMetadata = getModuleMetadata(moduleSlug);

  // Fallback to old TypeScript-based content
  const oldModule =
    !mdxModule && !mdxModuleMetadata
      ? getModuleBySlug(moduleSlug)
      : null;

  // If neither exists, show 404
  if (!mdxModule && !mdxModuleMetadata && !oldModule) {
    notFound();
  }

  // Use MDX if available
  if (mdxModule && mdxModuleMetadata) {
    const allModules = getAllModules();
    const moduleIndex = allModules.findIndex(
      (m) => m.metadata.slug === moduleSlug
    );

    // Get prerequisite module details
    const prerequisiteModules = mdxModuleMetadata.prerequisiteModules
      .map((prereqSlug) => {
        const prereqModule = allModules.find(
          (m) => m.metadata.slug === prereqSlug
        );
        if (prereqModule) {
          return {
            id: prereqModule.metadata.id,
            slug: prereqModule.metadata.slug,
            title: prereqModule.metadata.title,
          };
        }
        return null;
      })
      .filter((m): m is { id: string; slug: string; title: string } => m !== null);

    // Convert MDX lessons to the format expected by ModuleClient
    const lessons = mdxModule.lessons.map((lesson) => ({
      id: lesson.frontmatter.slug,
      slug: lesson.slug,
      title: lesson.frontmatter.title,
      description: lesson.frontmatter.description,
      duration: lesson.frontmatter.duration,
      order: lesson.frontmatter.order,
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
              <Link href="/progress">
                <Button variant="outline">My Progress</Button>
              </Link>
              <ModeToggle />
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <ModuleClient
            moduleSlug={moduleSlug}
            metadata={mdxModuleMetadata}
            lessons={lessons}
            quiz={mdxModule.quiz}
            moduleIndex={moduleIndex}
            totalModules={allModules.length}
            prerequisiteModules={prerequisiteModules}
          />
        </main>
      </div>
    );
  }

  // No module found
  return notFound();
}

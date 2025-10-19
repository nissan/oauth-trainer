import { Suspense } from "react";

interface MDXContentProps {
  moduleSlug: string;
  lessonSlug: string;
}

// Mapping of module and lesson slugs to MDX imports
// This is required because Turbopack needs static import paths
async function getMDXComponent(moduleSlug: string, lessonSlug: string) {
  // Module 01: Auth Fundamentals
  if (moduleSlug === "01-auth-fundamentals") {
    if (lessonSlug === "01-auth-vs-authz") {
      const { default: Component } = await import(
        "@/content/modules/01-auth-fundamentals/lessons/01-auth-vs-authz.mdx"
      );
      return Component;
    }
    if (lessonSlug === "02-idps-and-rps") {
      const { default: Component } = await import(
        "@/content/modules/01-auth-fundamentals/lessons/02-idps-and-rps.mdx"
      );
      return Component;
    }
    if (lessonSlug === "03-token-types") {
      const { default: Component } = await import(
        "@/content/modules/01-auth-fundamentals/lessons/03-token-types.mdx"
      );
      return Component;
    }
    if (lessonSlug === "04-claims-scopes-audience") {
      const { default: Component } = await import(
        "@/content/modules/01-auth-fundamentals/lessons/04-claims-scopes-audience.mdx"
      );
      return Component;
    }
    if (lessonSlug === "05-iam-evolution") {
      const { default: Component } = await import(
        "@/content/modules/01-auth-fundamentals/lessons/05-iam-evolution.mdx"
      );
      return Component;
    }
  }

  // Module 10: Applied Case Study
  if (moduleSlug === "10-applied-case-study") {
    if (lessonSlug === "executive-analysis") {
      const { default: Component } = await import(
        "@/content/modules/10-applied-case-study/lessons/01-executive-analysis.mdx"
      );
      return Component;
    }
    if (lessonSlug === "command-control-platform") {
      const { default: Component } = await import(
        "@/content/modules/10-applied-case-study/lessons/02-command-control-platform.mdx"
      );
      return Component;
    }
    if (lessonSlug === "cloud-telemetry-ai") {
      const { default: Component } = await import(
        "@/content/modules/10-applied-case-study/lessons/03-cloud-telemetry-ai.mdx"
      );
      return Component;
    }
    if (lessonSlug === "field-units-offline") {
      const { default: Component } = await import(
        "@/content/modules/10-applied-case-study/lessons/04-field-units-offline.mdx"
      );
      return Component;
    }
    if (lessonSlug === "api-analytics-portal") {
      const { default: Component } = await import(
        "@/content/modules/10-applied-case-study/lessons/05-api-analytics-portal.mdx"
      );
      return Component;
    }
    if (lessonSlug === "partner-federation") {
      const { default: Component } = await import(
        "@/content/modules/10-applied-case-study/lessons/06-partner-federation.mdx"
      );
      return Component;
    }
    if (lessonSlug === "future-architecture") {
      const { default: Component } = await import(
        "@/content/modules/10-applied-case-study/lessons/07-future-architecture.mdx"
      );
      return Component;
    }
  }

  // Return null if no matching MDX file found
  return null;
}

export async function MDXContent({ moduleSlug, lessonSlug }: MDXContentProps) {
  try {
    const Component = await getMDXComponent(moduleSlug, lessonSlug);

    if (!Component) {
      return (
        <div className="rounded-md border border-amber-500/50 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            MDX content not yet migrated for this lesson. Showing legacy content.
          </p>
        </div>
      );
    }

    return (
      <Suspense
        fallback={
          <div className="animate-pulse rounded-md bg-muted p-8">
            <div className="h-4 w-3/4 rounded bg-muted-foreground/20"></div>
          </div>
        }
      >
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <Component />
        </div>
      </Suspense>
    );
  } catch (error) {
    console.error("Error loading MDX content:", error);
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">
          Failed to load lesson content. Please try again later.
        </p>
      </div>
    );
  }
}

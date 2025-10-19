import type { MDXComponents } from "mdx/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Override default HTML elements
    h1: ({ className, ...props }) => (
      <h1
        className={cn(
          "scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mb-4",
          className
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }) => (
      <h2
        className={cn(
          "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10 mb-4",
          className
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }) => (
      <h3
        className={cn(
          "scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4",
          className
        )}
        {...props}
      />
    ),
    h4: ({ className, ...props }) => (
      <h4
        className={cn(
          "scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-3",
          className
        )}
        {...props}
      />
    ),
    p: ({ className, ...props }) => (
      <p
        className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
        {...props}
      />
    ),
    ul: ({ className, ...props }) => (
      <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
    ),
    ol: ({ className, ...props }) => (
      <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
    ),
    li: ({ className, ...props }) => (
      <li className={cn("mt-2", className)} {...props} />
    ),
    blockquote: ({ className, ...props }) => (
      <blockquote
        className={cn(
          "mt-6 border-l-4 border-primary pl-6 italic text-muted-foreground",
          className
        )}
        {...props}
      />
    ),
    code: ({ className, ...props }) => (
      <code
        className={cn(
          "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
          className
        )}
        {...props}
      />
    ),
    pre: ({ className, ...props }) => (
      <pre
        className={cn(
          "mb-4 mt-6 overflow-x-auto rounded-lg border bg-card p-4",
          className
        )}
        {...props}
      />
    ),
    table: ({ className, ...props }) => (
      <div className="my-6 w-full overflow-y-auto">
        <table className={cn("w-full", className)} {...props} />
      </div>
    ),
    tr: ({ className, ...props }) => (
      <tr
        className={cn("m-0 border-t p-0 even:bg-muted", className)}
        {...props}
      />
    ),
    th: ({ className, ...props }) => (
      <th
        className={cn(
          "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
          className
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }) => (
      <td
        className={cn(
          "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
          className
        )}
        {...props}
      />
    ),
    // Custom components for course content
    Callout: ({ type = "info", children }: { type?: "info" | "warning" | "success" | "danger"; children: React.ReactNode }) => {
      const variants = {
        info: "border-primary/30 bg-primary/5 text-foreground",
        warning: "border-yellow-500/30 bg-yellow-500/5 text-foreground",
        success: "border-success/30 bg-success/5 text-foreground",
        danger: "border-destructive/30 bg-destructive/5 text-foreground",
      };

      return (
        <Card className={cn("my-6", variants[type])}>
          <CardContent className="pt-6">
            {children}
          </CardContent>
        </Card>
      );
    },
    CodeBlock: ({ language, title, children }: { language?: string; title?: string; children: React.ReactNode }) => {
      return (
        <Card className="my-6">
          {title && (
            <CardHeader>
              <CardTitle className="text-sm font-mono">{title}</CardTitle>
            </CardHeader>
          )}
          <CardContent className={title ? "" : "pt-6"}>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4">
              <code className={language ? `language-${language}` : ""}>
                {children}
              </code>
            </pre>
          </CardContent>
        </Card>
      );
    },
    SecurityWarning: ({ children }: { children: React.ReactNode }) => {
      return (
        <Card className="my-6 border-destructive/50 bg-destructive/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <span className="text-2xl">⚠️</span>
              Security Warning
            </CardTitle>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      );
    },
    ...components,
  };
}

import { modules as oldModules } from "@/data/modules"
import { getAllModules } from "@/lib/content"
import type { Module } from "@/types"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function LearnPage() {
  // Combine MDX and old TypeScript modules
  const mdxModules = getAllModules()
  const mdxModuleSlugs = new Set(mdxModules.map(m => m.metadata.slug))

  // Convert MDX modules to the Module type expected by the UI
  const convertedMdxModules: Module[] = mdxModules.map(m => ({
    id: m.metadata.id,
    title: m.metadata.title,
    slug: m.metadata.slug,
    description: m.metadata.description,
    difficulty: m.metadata.difficulty,
    estimatedHours: m.metadata.estimatedHours,
    badge: {
      ...m.metadata.badge,
      id: `badge-${m.metadata.id}`,
      moduleId: m.metadata.id
    },
    learningObjectives: m.metadata.learningObjectives,
    prerequisiteModules: m.metadata.prerequisiteModules,
    order: m.metadata.order,
    lessons: m.lessons.map(lesson => ({
      id: lesson.frontmatter.slug,
      slug: lesson.slug,
      title: lesson.frontmatter.title,
      description: lesson.frontmatter.description,
      duration: lesson.frontmatter.duration,
      order: lesson.frontmatter.order,
      keyTakeaways: lesson.frontmatter.keyTakeaways,
      prerequisites: lesson.frontmatter.prerequisites,
      content: []
    })),
    quiz: m.quiz
  }))

  // Only include old modules that don't have MDX versions
  const filteredOldModules = oldModules.filter(m => !mdxModuleSlugs.has(m.slug))

  // Combine and sort by order
  const modules = [...convertedMdxModules, ...filteredOldModules].sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
          Learning Modules
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Master Identity and Access Management through comprehensive, hands-on modules
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Card key={module.id} className="flex flex-col">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <Badge variant={module.difficulty === "beginner" ? "default" : module.difficulty === "intermediate" ? "secondary" : "advanced"}>
                  {module.difficulty}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {module.estimatedHours}h
                </span>
              </div>
              <CardTitle className="text-xl">{module.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {module.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-end">
              {module.learningObjectives && module.learningObjectives.length > 0 && (
                <div className="mb-4 space-y-2">
                  <p className="text-sm font-medium">Learning Objectives:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {module.learningObjectives.slice(0, 3).map((objective, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span className="line-clamp-1">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Link href={`/learn/${module.slug}`}>
                  <Button className="w-full">View Module</Button>
                </Link>
                <div className="text-center text-sm text-muted-foreground">
                  {module.lessons.length} lessons
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

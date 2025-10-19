import { modules as oldModules } from "@/data/modules"
import { getAllModules } from "@/lib/content"
import type { Module } from "@/types"
import { HomeClient } from "./home-client"

export default function Home() {
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
      content: [] // Content is loaded separately for MDX
    })),
    quiz: m.quiz
  }))

  // Only include old modules that don't have MDX versions
  const filteredOldModules = oldModules.filter(m => !mdxModuleSlugs.has(m.slug))

  // Combine and sort by order
  const modules = [...convertedMdxModules, ...filteredOldModules].sort((a, b) => (a.order || 0) - (b.order || 0))

  return <HomeClient modules={modules} />
}
